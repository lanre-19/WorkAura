import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { getWorkspaces } from "@/features/workspaces/queries";

const DashboardPage = async () => {
  // Get the current user
  const currentUser = await getCurrent();

  // Redirect users to sign in pages if not authenticated
  if (!currentUser) redirect("/sign-in");

  // Get the workspaces from the database
  const workspaces = await getWorkspaces();

  // Redirect users to create a workspace if none exists, if not, redirect users to a workspace
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspaces/${workspaces.documents[0].$id}`);
  }
}
 
export default DashboardPage;