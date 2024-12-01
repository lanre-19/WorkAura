import * as z from "zod";
import { TaskStatus } from "./types";

export const createTaskSchema = z.object({
    name: z.string().trim().min(1, {
        message: "Name is required"
    }),
    status: z.nativeEnum(TaskStatus, {
        required_error: "Status is required"
    }),
    workspaceId: z.string().trim().min(1, {
        message: "Workspace Id is required"
    }),
    projectId: z.string().trim().min(1, {
        message: "Project Id is required"
    }),
    dueDate: z.coerce.date(),
    assigneeId: z.string().trim().min(1, {
        message: "Assignee Id is required"
    }),
    description: z.string().optional()
});