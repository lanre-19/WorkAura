import * as z from "zod";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { Query } from "node-appwrite";

import { sessionMiddleware } from "@/lib/session-middleware";
import { createAdminClient } from "@/lib/appwrite";
import { DATABASE_ID, MEMBERS_ID } from "@/config";
import { getMember } from "../utils";
import { Member, MemberRole } from "../types";

const app = new Hono()
  .get("/", sessionMiddleware, zValidator("query", z.object({ workspaceId: z.string() })), async (c) => {
    // Get all the users
    const { users } = await createAdminClient();
    // Get the databases
    const databases = c.get("databases");
    // Get the current user
    const user = c.get("user");

    // Get the workspace ID from the query
    const { workspaceId } = c.req.valid("query");

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }
    
    // Get all the members of a workspace from the database
    const members = await databases.listDocuments<Member>(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", workspaceId)]
    );

    // Populate the members of a workspace i.e. make their props more explicit
    const populatedMembers = await Promise.all(
      members.documents.map(async (member) => {
        // Get individual users from the members
        const user = await users.get(member.userId);
        
        // Return the members with their names and email addresses
        return {
          ...member,
          name: user.name,
          email: user.email,
          role: member.role
        }
      })
    );

    return c.json({
      data: {
        ...members,
        documents: populatedMembers
      }
    });
  })
  .delete("/:memberId", sessionMiddleware, async (c) => {
    // Get the member ID from the param
    const { memberId } = c.req.param();
    // Get the current user
    const user = c.get("user");
    // Get the databases
    const databases = c.get("databases");

    // Get the member to delete
    const memberToDelete = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    // Get all the members in a workspace
    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    const member = await getMember({
      databases,
      workspaceId: memberToDelete.workspaceId,
      userId: user.$id
    });

    // Check if user is not a member of workspace
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if user is trying to remove a member from workspace, and he's not an admin. If true, throw an error
    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if the total number of members in workspace is 1 i.e. if there is only one member left in a workspace. If true, trhow an error
    if (allMembersInWorkspace.total === 1) {
      return c.json({ error: "Cannot delete the only member in a workspace" }, 400);
    }

    // Delete a member from workspace
    await databases.deleteDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    return c.json({ data: { $id: memberToDelete.$id } });
  })
  .patch("/:memberId", sessionMiddleware, zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })), async (c) => {
    // Get the member ID from the param
    const { memberId } = c.req.param();
    // Get the role from the json
    const { role } = c.req.valid("json");
    // Get the current user
    const user = c.get("user");
    // Get the databases
    const databases = c.get("databases");

    // Get the member to delete
    const memberToUpdate = await databases.getDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId
    );

    // Get all the members in a workspace
    const allMembersInWorkspace = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [Query.equal("workspaceId", memberToUpdate.workspaceId)]
    );

    const member = await getMember({
      databases,
      workspaceId: memberToUpdate.workspaceId,
      userId: user.$id
    });

    // Check if user is not a member of workspace
    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if user is trying to update a member from workspace, and he's not an admin. If true, throw an error
    if (member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Check if the total number of members in workspace is 1 i.e. if there is only one member left in a workspace. If true, trhow an error
    if (allMembersInWorkspace.total === 1) {
      return c.json({ error: "Cannot update the only member in a workspace" }, 400);
    }

    // Update a member from workspace
    await databases.updateDocument(
      DATABASE_ID,
      MEMBERS_ID,
      memberId,
      {
        role
      }
    );

    return c.json({ data: { $id: memberToUpdate.$id } });
  });

export default app;