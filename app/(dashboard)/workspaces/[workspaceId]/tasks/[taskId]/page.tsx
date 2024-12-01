import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import TaskIdClient from "./client";

const TaskIdPage = async () => {
    // Get the current user
    const currentUser = await getCurrent();

    // Redirect users to sign in pages if not authenticated
    if (!currentUser) redirect("/sign-in");
    
    return <TaskIdClient />
}
 
export default TaskIdPage;