import { Query } from "node-appwrite";

import { getMember } from "@/features/members/utils";

import {
    DATABASE_ID,
    MEMBERS_ID,
    WORKSPACES_ID
} from "@/config";
import { Workspace } from "./types";
import { createSessionClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
    // Get the account and databases from the session client
    const { account, databases } = await createSessionClient();
        
    // Get the current user
    const user = await account.get();

    // Get the members from a selected workspace
    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        // Query the current user ID
        [Query.equal("userId", user.$id)]
    );

    // Check if there is no member in a workspace. If true, return an empty array and no user
    if (members.total === 0) {
        return { documents: [], total: 0 };
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

    return workspaces;
};

