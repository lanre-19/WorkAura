import "server-only";

import {
    Account,
    Storage,
    Client,
    Databases,
    Models,
    type Account as AccountType,
    type Users as UsersType,
    type Databases as DatabasesType,
    type Storage as StorageType
} from "node-appwrite";

import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";

import { AUTH_COOKIE } from "@/features/auth/constants";

type AdditionalCtx = {
    Variables: {
        account: AccountType;
        users: UsersType;
        databases: DatabasesType;
        storage: StorageType;
        user: Models.User<Models.Preferences>;
    }
};

export const sessionMiddleware = createMiddleware<AdditionalCtx>(
    async (c, next) => {
        // Initiate a new client from Appwrite, then set the endpoint and project
        const client = new Client()
          .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
          .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

        // Get the cookie from the active session
        const session = getCookie(c, AUTH_COOKIE);

        // Check if the cookie doesn't exist. If false, throw an error
        if (!session) {
            return c.json({ error: "Unauthorized" }, 401);
        }

        // Set the session to the current session if the above statement is true
        client.setSession(session);

        // Initialize a new account and set it to the client newly initialized client above to get the current logged in user
        const account = new Account(client);
        // Initialize a new DB and set it to the client newly initialized client above
        const databases = new Databases(client);
        // Initialize a new storage and set it to the client newly initialized client above
        const storage = new Storage(client);

        // Get the currently logged in user
        const user = await account.get();

        c.set("account", account);
        c.set("databases", databases);
        c.set("storage", storage);
        c.set("user", user);

        await next();
    }
);