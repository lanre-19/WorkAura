import * as z from "zod";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { zValidator } from "@hono/zod-validator";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";

import { Task, TaskStatus } from "@/features/tasks/types";
import { getMember } from "@/features/members/utils";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/config";
import { createProjectSchema, updateProjectSchema } from "../schemas";
import { Project } from "../types";

const app = new Hono()
  .post("/", sessionMiddleware, zValidator("form", createProjectSchema), async (c) => {
    // Get the databases
    const databases = c.get("databases");
    // Get the storage
    const storage = c.get("storage");
    // Get the current user
    const user = c.get("user");

    const { name, image, workspaceId } = c.req.valid("form");

    // Get the member of a selected workspace
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id
    });

    // Check if user is not a member of selected workspace. If true, throw an error
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let uploadedImageUrl: string | undefined;

    if (image instanceof File) {
        // Create an image file in the storage
        const file = await storage.createFile(
            IMAGES_BUCKET_ID,
            ID.unique(),
            image
        );
        
        // Create or get the file preview
        const arrayBuffer = await storage.getFilePreview(
            IMAGES_BUCKET_ID,
            file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
    }

    // Create a project in a workspace in the DB
    const project = await databases.createDocument(
        DATABASE_ID,
        PROJECTS_ID,
        ID.unique(),
        {
            name,
            imageUrl: uploadedImageUrl,
            workspaceId
        }
    );

    return c.json({ data: project });
}).get("/", sessionMiddleware, zValidator("query", z.object({ workspaceId: z.string() })), async (c) => {
    // Get the current user
    const user = c.get("user");
    // Get the databases
    const databases = c.get("databases");

    // Get the workspace ID from the query
    const { workspaceId } = c.req.valid("query");

    if (!workspaceId) {
      return c.json({ error: "Missing workspace Id" }, 400);
    }

    // Get the member of a selected workspace
    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });

    // Check if user is not a member of the current workspace. If true, throw an error
    if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    // Fetch all the projects in the database
    const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [
            Query.equal("workspaceId", workspaceId),
            Query.orderDesc("$createdAt")
        ]
    );

    return c.json({ data: projects });
}).patch("/:projectId", sessionMiddleware, zValidator("form", updateProjectSchema), async (c) => {
  // Get the databases
  const databases = c.get("databases");
  // Get the storage
  const storage = c.get("storage");
  // Get the current user
  const user = c.get("user");

  const { projectId } = c.req.param();
  // Get the name and image from the context
  const { name, image } = c.req.valid("form");

  // Fetch an existing project from the database
  const existingProject = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  const member = await getMember({
    databases,
    workspaceId: existingProject.workspaceId,
    userId: user.$id
  });

  // Check if user is not a member of selected workspace. If true, throw an error
  if (!member) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  let uploadedImageUrl: string | undefined;

  if (image instanceof File) {
    // Create an image file in the storage
    const file = await storage.createFile(
      IMAGES_BUCKET_ID,
      ID.unique(),
      image
    );
      
    // Create or get the file preview
    const arrayBuffer = await storage.getFilePreview(
      IMAGES_BUCKET_ID,
      file.$id
    );

    uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString("base64")}`;
  } else {
    uploadedImageUrl = image;
  }

  const project = await databases.updateDocument(
      DATABASE_ID,
      PROJECTS_ID,
      projectId,
      {
        name,
        imageUrl: uploadedImageUrl
      }
  );

  return c.json({ data: project });
}).delete("/:projectId", sessionMiddleware, async (c) => {
  // Get the database
  const databases = c.get("databases");
  // Get the user
  const user = c.get("user");

  const { projectId } = c.req.param();

  // Fetch an existing project from the selected workspace in the database
  const existingProject = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  const member = await getMember({
      databases,
      workspaceId: existingProject.workspaceId,
      userId: user.$id
  });
  
  // Check if user is not a member. If true, throw an error
  if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
  }

  // TODO: Delete projects, members and tasks

  // Delete workspace
  await databases.deleteDocument(
      DATABASE_ID,
      PROJECTS_ID,
      projectId
  );

  return c.json({ data: { $id: existingProject.$id} });
}).get("/:projectId", sessionMiddleware, async (c) => {
  // Get the current user
  const user = c.get("user");
  // Get the databases
  const databases = c.get("databases");
  // Get the project ID from the param
  const { projectId } = c.req.param();

  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  // Get the member of a selected workspace
  const member = await getMember({
    databases,
    workspaceId: project.workspaceId,
    userId: user.$id
  });

  // Check if user is not a member of the current workspace. If true, throw an error
  if (!member) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json({ data: project });
}).get("/:projectId/analytics", sessionMiddleware, async (c) => {
  // Get the databases
  const databases = c.get("databases");
  // Get the current user
  const user = c.get("user");

  // Get the projectId from the params
  const { projectId } = c.req.param();

  const project = await databases.getDocument<Project>(
    DATABASE_ID,
    PROJECTS_ID,
    projectId
  );

  // Get the member of a selected workspace
  const member = await getMember({
    databases,
    workspaceId: project.workspaceId,
    userId: user.$id
  });

  // Check if user is not a member of the current workspace. If true, throw an error
  if (!member) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // The current date
  const now = new Date();
  // The beginning of the month
  const monthStart = startOfMonth(now);
  // The end of the month
  const monthEnd = endOfMonth(now);
  // The beginning of the previous month
  const lastMonthStart = startOfMonth(subMonths(now, 1));
  // The end of the previous month
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  // Get all the tasks for the current month
  const thisMonthTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", monthStart.toISOString()),
      Query.lessThanEqual("$createdAt", monthEnd.toISOString())
    ]
  );

  // Get all the tasks for the immediate previous month
  const lastMonthTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
    ]
  );

  // Get the total number of tasks for this month
  const taskCount = thisMonthTasks.total;
  // Calculate the diff of the taskCount and the lastMonthTasks
  const taskDifference = taskCount - lastMonthTasks.total;

  // Get all the assigned tasks for the current month
  const thisMonthAssignedTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", monthStart.toISOString()),
      Query.lessThanEqual("$createdAt", monthEnd.toISOString())
    ]
  );

  // Get all the assigned tasks for the immediate previous month
  const lastMonthAssignedTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.equal("assigneeId", member.$id),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
    ]
  );

  // Get the total number of assigned task for the current month
  const assignedTaskCount = thisMonthAssignedTasks.total;
  // Calculate the diff of the current month assignedTaskCount and the previous month assignedTask
  const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.total;

  // Get all the incomplete tasks for the current month
  const thisMonthIncompleteTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", monthStart.toISOString()),
      Query.lessThanEqual("$createdAt", monthEnd.toISOString())
    ]
  );

  // Get all the incomplete tasks for the immediate previous month
  const lastMonthIncompleteTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
    ]
  );

  // Get the total number of incomplete tasks for current month
  const incompleteTasksCount = thisMonthIncompleteTasks.total;
  // Calculate the diff of the total number of incomplete tasks for the current month and the total number of incomplete tasks for the immediate previous month
  const incompleteTasksDifference = incompleteTasksCount - lastMonthIncompleteTasks.total;

  // Get all the completed tasks for the current month
  const thisMonthCompletedTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", monthStart.toISOString()),
      Query.lessThanEqual("$createdAt", monthEnd.toISOString())
    ]
  );

  // Get all the completed tasks for the immediate previous month
  const lastMonthCompletedTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
    ]
  );

  // Get the total number of completed tasks for current month
  const completedTasksCount = thisMonthCompletedTasks.total;
  // Calculate the diff of the total number of completed tasks for the current month and the total number of completed tasks for the immediate previous month
  const completedTasksDifference = completedTasksCount - lastMonthCompletedTasks.total;

  // Get all the overdue tasks for the current month
  const thisMonthOverdueTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.notEqual("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.toISOString()),
      Query.greaterThanEqual("$createdAt", monthStart.toISOString()),
      Query.lessThanEqual("$createdAt", monthEnd.toISOString())
    ]
  );

  // Get all the overdue tasks for the immediate previous month
  const lastMonthOverdueTasks = await databases.listDocuments<Task>(
    DATABASE_ID,
    TASKS_ID,
    [
      Query.equal("projectId", projectId),
      Query.equal("status", TaskStatus.DONE),
      Query.lessThan("dueDate", now.toISOString()),
      Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
      Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString())
    ]
  );

  // Get the total number of overdue tasks for current month
  const overdueTasksCount = thisMonthOverdueTasks.total;
  // Calculate the diff of the total number of overdue tasks for the current month and the total number of overdue tasks for the immediate previous month
  const overdueTasksDifference = overdueTasksCount - lastMonthOverdueTasks.total;

  return c.json({
    data: {
      taskCount,
      taskDifference,
      assignedTaskCount,
      assignedTaskDifference,
      completedTasksCount,
      completedTasksDifference,
      incompleteTasksCount,
      incompleteTasksDifference,
      overdueTasksCount,
      overdueTasksDifference
    }
  });
});

export default app;