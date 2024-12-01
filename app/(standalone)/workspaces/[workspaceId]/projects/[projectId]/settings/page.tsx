import { redirect } from "next/navigation";

import ProjectIdSettingsClient from "./client";

import { getCurrent } from "@/features/auth/queries";

const ProjectIdSettingsPage = async () => {
    // Get the current user
    const currentUser = await getCurrent();

    // Redirect users to sign in pages if not authenticated
    if (!currentUser) redirect("/sign-in");

    return <ProjectIdSettingsClient />;
}
 
export default ProjectIdSettingsPage;