import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import SignInCard from "@/features/auth/components/sign-in-card";

const SignInPage = async () => {
    const currentUser = await getCurrent();

    if (currentUser) {
        redirect("/");
    }

    return <SignInCard />
}
 
export default SignInPage;