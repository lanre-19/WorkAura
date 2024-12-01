import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import TasksViewSwitcher from "@/features/tasks/components/tasks-view-switcher";

const TasksPage = async () => {
    // Get the current user
    const currentUser = await getCurrent();

    // Redirect users to sign in pages if not authenticated
    if (!currentUser) redirect("/sign-in");

    return (
        <div
          className="flex flex-col h-full"
        >
            <TasksViewSwitcher />
        </div>
    );
}
 
export default TasksPage;