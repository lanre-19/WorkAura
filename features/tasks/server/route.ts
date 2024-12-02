import * as z from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";
import { Project } from "@/features/projects/types";

import { sessionMiddleware } from "@/lib/session-middleware";
import { createAdminClient } from "@/lib/appwrite";
import {
    DATABASE_ID,
    MEMBERS_ID,
    PROJECTS_ID,
    TASKS_ID
} from "@/config";
import { createTaskSchema } from "../schemas";
import { Task, TaskStatus } from "../types";

const app = new Hono()
  .post("/", sessionMiddleware, zValidator("json", createTaskSchema), async (c) => {
    // Get the current user
    const user = c.get("user");
    // Get the databases
    const databases = c.get("databases");

    // Get the required parameters from the json
    const {
        name,
        description,
        status,
        dueDate,
        workspaceId,
        projectId,
        assigneeId
    } = c.req.valid("json");

    // Get a user that is a member of selected workspace
    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });

    // Check if user is not a member of selected workspace. If true, throw an error
    if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    // Get the task at the first position
    const firstPositionedTask = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
            Query.equal("status", status),
            Query.equal("workspaceId", workspaceId),
            Query.orderAsc("position"),
            Query.limit(1)
        ]
    );

    // Get the new position of task
    const newPosition = firstPositionedTask.documents.length > 0 ? firstPositionedTask.documents[0].position + 1000 : 1000;

    // Create a new task in a project, in a workspace, in the database
    const task = await databases.createDocument(
        DATABASE_ID,
        TASKS_ID,
        ID.unique(),
        {
            name,
            description,
            status,
            dueDate,
            workspaceId,
            projectId,
            assigneeId,
            position: newPosition
        }
    );

    return c.json({ data: task });
  })
  .get("/", sessionMiddleware, zValidator("query", z.object({
    workspaceId: z.string(),
    projectId: z.string().nullish(),
    assigneeId: z.string().nullish(),
    status: z.nativeEnum(TaskStatus).nullish(),
    search: z.string().nullish(),
    dueDate: z.string().nullish()
  })), async (c) => {
    // Get the users
    const { users } = await createAdminClient();
    // Get the databases
    const databases = c.get("databases");
    // Get the current user
    const user = c.get("user");

    // Get the required parameters from the query
    const {
        workspaceId,
        projectId,
        assigneeId,
        status,
        search,
        dueDate
    } = c.req.valid("query");

    // Get a user that is a member of selected workspace
    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });

    // Check if user is not a member of selected workspace. If true, throw an error
    if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    // Create a query for the workspace ID
    const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt")
    ];

    // Check if the project ID exists. If true, log the project ID in the console
    if (projectId) {
        console.log("projectId: ", projectId);
        query.push(Query.equal("projectId", projectId));
    }

    // Check if the status exists. If true, log the status in the console
    if (status) {
        console.log("status: ", status);
        query.push(Query.equal("status", status));
    }

    // Check if the assignee ID. If true, log the assignee ID in the console
    if (assigneeId) {
        console.log("assigneeId: ", assigneeId);
        query.push(Query.equal("assigneeId", assigneeId));
    }

    // Check if the due date. If true, log the due date in the console
    if (dueDate) {
        console.log("dueDate: ", dueDate);
        query.push(Query.equal("dueDate", dueDate));
    }

    // Check if the search. If true, log the search in the console
    if (search) {
        console.log("search: ", search);
        query.push(Query.search("name", search));
    }

    // Fetch the tasks that exist in the selected project, of a selected workspace in the database
    const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
    );

    // Get the IDs for each project in a selected workspace
    const projectIds = tasks.documents.map((task) => task.projectId);
    // Get the IDs for each assignee in a selected workspace
    const assigneeIds = tasks.documents.map((task) => task.assigneeId);

    // Get all the projects in a selected workspace
    const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
    );

    // Get all the members in a selected workspace
    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
    );

    // Get the assignees from the users above
    const assignees = await Promise.all(
        members.documents.map(async (member) => {
            // Get a specific member
            const user = await users.get(member.userId);
            
            return {
                ...member,
                name: user.name || user.email,
                email: user.email
            }
        })
    );

    // Get the populated tasks
    const populatedTasks = tasks.documents.map((task) => {
        // Get a project related to a specific task
        const project = projects.documents.find((project) => project.$id === task.projectId);

        // Get the assignees related to a specific task
        const assignee = assignees.find((assignee) => assignee.$id === task.assigneeId);

        return {
            ...task,
            project,
            assignee
        };
    });

    return c.json({
        data: {
            ...tasks,
            documents: populatedTasks
        }
    });
  })
  .get("/:taskId", sessionMiddleware, async (c) => {
    // Get the current user
    const currentUser = c.get("user");
    // Get the databases
    const databases = c.get("databases");

    // Get the task ID from the params
    const { taskId } = c.req.param();

    // Get the users in the database
    const { users } = await createAdminClient();

    // Get the selected task from the database
    const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
    );

    const currentMember = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: currentUser.$id
    });

    // Check if user is not a member. If true, throw an error
    if (!currentMember) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    // Get the project associated with the selected task
    const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        task.projectId
    );

    // Get member associated with the selected task
    const member = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
        task.assigneeId
    );

    const user = await users.get(member.userId);

    const assignee = {
        ...member,
        name: user.name || user.email,
        email: user.email
    };
    
    return c.json({
        data: {
            ...task,
            project,
            assignee
        }
    });
  })
  .patch("/:taskId", sessionMiddleware, zValidator("json", createTaskSchema.partial()), async (c) => {
    // Get the current user
    const user = c.get("user");
    // Get the databases
    const databases = c.get("databases");

    // Get the required parameters from the json
    const {
        name,
        description,
        status,
        dueDate,
        projectId,
        assigneeId
    } = c.req.valid("json");
    // Get the task ID from the param
    const { taskId } = c.req.param();

    // Get an existing task
    const existingTask = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
    );

    // Get a user that is a member of selected workspace
    const member = await getMember({
        databases,
        workspaceId: existingTask.workspaceId,
        userId: user.$id
    });

    // Check if user is not a member of selected workspace. If true, throw an error
    if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    // Create a new task in a project, in a workspace, in the database
    const task = await databases.updateDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId,
        {
            name,
            description,
            status,
            dueDate,
            projectId,
            assigneeId
        }
    );

    return c.json({ data: task });
  })
  .delete("/:taskId", sessionMiddleware, async (c) => {
    // Get the current user
    const user = c.get("user");
    // Get the databases
    const databases = c.get("databases");
    
    // Get the task ID from the params
    const { taskId } = c.req.param();
    
    // Get a selected task from the database
    const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskId
    );

    const member = await getMember({
        databases,
        workspaceId: task.workspaceId,
        userId: user.$id
    });

    // Check if user is not a member. If true, throw an error
    if (!member) {
        return c.json({ error: "Unatuhorized" }, 401);
    }

    // Delete selected task
    await databases.deleteDocument(
        DATABASE_ID,
        TASKS_ID,
        taskId
    );

    return c.json({
        data: {
            $id: taskId
        }
    });
  })
  .post("/bulk-update", sessionMiddleware, zValidator("json", z.object({
    tasks: z.array(
        z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000)
        })
    )
  })), async (c) => {
    // Get the databases
    const databases = c.get("databases");
    // Get the current user
    const user = c.get("user");
    // Get the tasks from the json
    const { tasks } = c.req.valid("json");

    // Get the task list to update
    const tasksToUpdate = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        [Query.contains("$id", tasks.map((task) => task.$id))]
    );

    // Get the wokspace IDs where the tasks belong to
    const workspaceIds = new Set(tasksToUpdate.documents.map((task) => task.workspaceId));

    if (workspaceIds.size !== 1) {
        return c.json({ error: "All tasks must belong to the same workspace" }, 400);
    }

    const workspaceId = workspaceIds.values().next().value;

    // Check if the workspace ID of a selected task doesn't exist. If true, throw an error
    if (!workspaceId) {
        return c.json({ error: "Workspace ID is required" }, 400);
    }

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });

    // Check if user is not a member of the selected workspace. If true, throw an error
    if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    // Update the selected task
    const updatedTask = Promise.all(
        tasks.map(async (task) => {
            // Extract the required information from the task that is to be updated
            const { $id, status, position } = task;

            return databases.updateDocument<Task>(
                DATABASE_ID,
                TASKS_ID,
                $id,
                {
                    status,
                    position
                }
            );
        })
    );

    return c.json({ data: updatedTask });
  });

export default app;