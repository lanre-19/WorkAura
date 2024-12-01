import "server-only";

import { cookies } from "next/headers";
import {
    Client,
    Databases,
    Users,
    Account,
    Storage
} from "node-appwrite";

import { AUTH_COOKIE } from "@/features/auth/constants";

export async function createSessionClient () {
    // Initiate a new client from Appwrite, then set the endpoint and project
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!);

    // Get the session from the cookies
    const session = cookies().get(AUTH_COOKIE);

    // Check if there is no user session. If true, do not return anything
    if (!session || !session.value) {
        throw new Error("Unauthorized");
    }

    // Set the users's session to the current session if the above statement is true
    client.setSession(session.value);

    return {
        get account() {
            return new Account(client);
        },
        get databases() {
            return new Databases(client);
        }
    }
};

export async function createAdminClient() {
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
      .setKey(process.env.NEXT_APPWRITE_KEY!);

    return {
        get account() {
            return new Account(client);
        },
        get users() {
            return new Users(client);
        }
    }
};