import * as z from "zod";

export const createWorkspaceSchema = z.object({
    name: z.string().trim().min(1, {
        message: "Workspace name is required"
    }),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ]).optional()
});

export const updateWorkspaceSchema = z.object({
    name: z.string().trim().min(1, {
        message: "Characters should more more than 1"
    }).optional(),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ]).optional()
});