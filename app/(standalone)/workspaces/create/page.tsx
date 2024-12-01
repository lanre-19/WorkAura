import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import CreateWorkspaceForm from "@/features/workspaces/components/create-workspace-form";

const WorkspaceCreatePage = async () => {
  // Get the current user
  const currentUser = await getCurrent();

  // Redirect users to sign in pages if not authenticated
  if (!currentUser) redirect("/sign-in");

    return (
        <div
          className="w-full lg:max-w-xl"
        >
            <CreateWorkspaceForm />
        </div>
    );
}
 
export default WorkspaceCreatePage;