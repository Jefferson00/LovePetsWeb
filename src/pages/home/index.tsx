import { useRouter } from "next/router";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function SignUp() {
    const { user, loading } = useContext(AuthContext);
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user]);

    if(loading || !user){
        return null
    }

    return (
        <div>
            <h1>teste</h1>
        </div>
    )
}