import { Hono } from "hono";
import { setCookie, deleteCookie } from "hono/cookie";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";

import { loginSchema, registerSchema } from "../schemas";
import { AUTH_COOKIE } from "../constants";
import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono().get("/current", sessionMiddleware, (c) => {
    const user = c.get("user");

    return c.json({ data: user });
}).post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");

    // Create an account for user on the admin's end
    const { account } = await createAdminClient();
    // Create a session, and pass the user's data
    const session = await account.createEmailPasswordSession(email, password);

    // Create a cookie for the session for extra security
    setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30
    });

    return c.json({ success: true });
}).post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = c.req.valid("json");

    // Create an account for user on the admin's end
    const { account } = await createAdminClient();
    // Create a user from the account
    await account.create(
        // Create a unique ID for user
        ID.unique(),
        email,
        password,
        name
    );

    // Create a session, and pass the user's data
    const session = await account.createEmailPasswordSession(email, password);
    
    // Create a cookie for the session for extra security
    setCookie(c, AUTH_COOKIE, session.secret, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30
    });

    return c.json({ success: true });
}).post("/logout", sessionMiddleware, async (c) => {
    const account = c.get("account");

    deleteCookie(c, AUTH_COOKIE);
    
    await account.deleteSession("current");

    return c.json({ success: true });
});

export default app;