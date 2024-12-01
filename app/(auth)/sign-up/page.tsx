import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import SignUpCard from "@/features/auth/components/sign-up-card";

const SignUpPage = async () => {
    const currentUser = await getCurrent();
    
    if (currentUser) {
        redirect("/");
    }

    return <SignUpCard />
}
 
export default SignUpPage;