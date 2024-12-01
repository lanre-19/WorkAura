import { redirect } from "next/navigation";

import MembersPageClient from "./client";

import { getCurrent } from "@/features/auth/queries";

const MembersPage = async () => {
    // Get the current user
    const user = await getCurrent();

    // Check if there is no current user. If true, redirect user to the sign in page
    if (!user) {
        redirect("/sign-in");
    }
    
    return <MembersPageClient />;
}
 
export default MembersPage;