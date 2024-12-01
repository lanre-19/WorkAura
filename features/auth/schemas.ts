import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, {
        message: "Password is required"
    })
});

export const registerSchema = z.object({
    name: z.string().min(3, {
      message: "Name is required"
    }),
    email: z.string().trim().min(1, {
      message: "Email is required"
    }),
    password: z.string().min(1, {
      message: "Password should be at least than 1 character"
    })
});