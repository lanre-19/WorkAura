import { redirect } from "next/navigation";

import ProjectIdClient from "./client";

import { getCurrent } from "@/features/auth/queries";

const ProjectIdPage = async () => {
  // Get the current user
  const currentUser = await getCurrent();

  // Redirect users to sign in pages if not authenticated
  if (!currentUser) redirect("/sign-in");

  return (
    <ProjectIdClient />
  );
};

export default ProjectIdPage;
