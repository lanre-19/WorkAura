import { redirect } from "next/navigation";

import WorkspaceIdClientPage from "./client";

import { getCurrent } from "@/features/auth/queries";

const WorkspaceIdPage = async () => {
  // Get the current user
  const currentUser = await getCurrent();

  // Redirect users to sign in pages if not authenticated
  if (!currentUser) redirect("/sign-in");

    return <WorkspaceIdClientPage />;
}
 
export default WorkspaceIdPage;