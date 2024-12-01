import * as z from "zod";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";


import { MemberRole } from "@/features/members/types";
import { getMember } from "@/features/members/utils";
import { Task, TaskStatus } from "@/features/tasks/types";

import { generateInviteCode } from "@/lib/utils";
import { sessionMiddleware } from "@/lib/session-middleware";
import {
    DATABASE_ID,
    IMAGES_BUCKET_ID,
    MEMBERS_ID,
    TASKS_ID,
    WORKSPACES_ID
} from "@/config";
import { Workspace } from "../types";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    // Get the current user
    const user = c.get("user");
    // Get the databases
    const databases = c.get("databases");

    // Get the members from a selected workspace
    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        // Query the current user ID
        [Query.equal("userId", user.$id)]
    );

    // Check if there is no member in a workspace. If true, return an empty array and no user
    if (members.total === 0) {
        return c.json({ data: {
            documents: [],
            total: 0
        } });
    }

    // Get the respective IDs of the workspaces from the their members
    const workspaceIds = members.documents.map((member) => member.workspaceId);
    
    // Get the workspaces from the databases with their respective IDs
    const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID,
        [
            Query.orderDesc("$createdAt"),
            Query.contains("$id", workspaceIds)
        ]
    );

    return c.json({ data: workspaces });
}).post("/", zValidator("form", createWorkspaceSchema), sessionMiddleware, async (c) => {
    // Get the databases
    const databases = c.get("databases");
    // Get the storage
    const storage = c.get("storage");
    // Get the current user
    const user = c.get("user");

    const { name, image } = c.req.valid("form");

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

    // Create a workspace in the DB
    const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
            name,
            userId: user.$id,
            imageUrl: uploadedImageUrl,
            // Generate invite codes of 10 characters for newly created workspaces
            inviteCode: generateInviteCode(10)
        }
    );

    // Create new members in the newly created workspace with a default of member
    await databases.createDocument(
        DATABASE_ID,
        MEMBERS_ID,
        ID.unique(),
        {
            userId: user.$id,
            workspaceId: workspace.$id,
            role: MemberRole.ADMIN
        }
    )

    return c.json({ data: workspace });
}).patch("/:workspaceId", sessionMiddleware, zValidator("form", updateWorkspaceSchema), async (c) => {
    // Get the databases
    const databases = c.get("databases");
    // Get the storage
    const storage = c.get("storage");
    // Get the current user
    const user = c.get("user");

    const { workspaceId } = c.req.param();
    // Get the name and image from the context
    const { name, image } = c.req.valid("form");

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });

    // Check if there is no member, and the member is not ADMIN. If true, throw an error
    if (!member || member.role !== MemberRole.ADMIN) {
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

    const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
            name,
            imageUrl: uploadedImageUrl
        }
    );

    return c.json({ data: workspace });
}).delete("/:workspaceId", sessionMiddleware, async (c) => {
    // Get the database
    const databases = c.get("databases");
    // Get the user
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });
    
    // Check if there is no member, and the member is not ADMIN. If true, throw an error
    if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    // TODO: Delete projects, members and tasks

    // Delete workspace
    await databases.deleteDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
    );

    return c.json({ data: { $id: workspaceId} });
}).post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    // Get the database
    const databases = c.get("databases");
    // Get the user
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });
    
    // Check if there is no member, and the member is not ADMIN. If true, throw an error
    if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    // TODO: Delete projects, members and tasks

    // Delete workspace
    const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
            inviteCode: generateInviteCode(10)
        }
    );

    return c.json({ data: workspace });
}).post("/:workspaceId/join", sessionMiddleware, zValidator("json", z.object({ code: z.string() })), async (c) => {
    // Get the workspace ID from the param
    const { workspaceId } = c.req.param();
    // Get the code from the json
    const { code } = c.req.valid("json");

    // Get the databases
    const databases = c.get("databases");
    // Get the current user
    const user = c.get("user");

    const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id
    });

    // Check if user is already a member of the workspace. If true, throw an error
    if (member) {
        return c.json({ error: "Already a member" }, 400);
    }

    // Get the workspace from the database
    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
    );

    // Check if the invite code of workspace does not match the code from the json. If true, throw an error
    if (workspace.inviteCode !== code) {
        return c.json({ error: "Invalid invite code" }, 400);
    }

    // Create a new member in the workspace
    await databases.createDocument(
        DATABASE_ID,
        MEMBERS_ID,
        ID.unique(),
        {
            workspaceId,
            userId: user.$id,
            role: MemberRole.MEMBER
        }
    );

    return c.json({ data: workspace });
}).get("/:workspaceId", sessionMiddleware, async (c) => {
    // Get the current user
    const user = c.get("user");
    // Get the databases
    const databases = c.get("databases");
    // Get the project ID from the param
    const { workspaceId } = c.req.param();
  
    // Get the member of a selected workspace
    const member = await getMember({
      databases,
      workspaceId: workspaceId,
      userId: user.$id
    });
  
    // Check if user is not a member of the current workspace. If true, throw an error
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
    );
  
    return c.json({ data: workspace });
}).get("/:workspaceId/info", sessionMiddleware, async (c) => {
    // Get the databases
    const databases = c.get("databases");
    // Get the project ID from the param
    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId
    );
  
    return c.json({
        data: {
            $id: workspace.$id,
            name: workspace.name,
            image: workspace.imageUrl
        }
    });
}).get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    // Get the databases
    const databases = c.get("databases");
    // Get the current user
    const user = c.get("user");
  
    // Get the workspaceId from the params
    const { workspaceId } = c.req.param();
  
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
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", monthStart.toISOString()),
        Query.lessThanEqual("$createdAt", monthEnd.toISOString())
      ]
    );
  
    // Get all the tasks for the immediate previous month
    const lastMonthTasks = await databases.listDocuments<Task>(
      DATABASE_ID,
      TASKS_ID,
      [
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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
        Query.equal("workspaceId", workspaceId),
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