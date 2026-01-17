import { useAuthCallback } from "@/hooks/useAuth";
import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";

const AuthSync = () => {
    const { isSignedIn } = useAuth();
    const { user } = useUser();
    const { mutateAsync: syncAuth } = useAuthCallback();
    const hasSynced = useRef(false);

    useEffect(() => {
        if (isSignedIn && user && !hasSynced.current) {
            hasSynced.current = true;

            syncAuth(undefined, {
                onSuccess: (data) => {
                    console.log("Sync success for user: ", data.name);
                },
                onError: (data) => {
                    console.error("Sync error for user: ", data.name);
                }
            })
        }
    }, [isSignedIn, user]);

    return null;
}

export default AuthSync