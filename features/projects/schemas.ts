import * as z from "zod";

export const createProjectSchema = z.object({
    name: z.string().trim().min(1, {
        message: "Project name is required"
    }),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ]).optional(),
    workspaceId: z.string()
});

export const updateProjectSchema = z.object({
    name: z.string().trim().min(1, {
        message: "Characters should more more than 1"
    }).optional(),
    image: z.union([
        z.instanceof(File),
        z.string().transform((value) => value === "" ? undefined : value)
    ]).optional(),
    workspaceId: z.string()
});