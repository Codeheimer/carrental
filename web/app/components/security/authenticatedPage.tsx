import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthenticatedRouteProps {
    children: ReactNode
}

export default function AuthenticatedPage({ children }: AuthenticatedRouteProps): JSX.Element {
    const router = useRouter();
    const { authenticationService } = useGlobalServiceStore();
    useEffect(() => {
        authenticationService.isAuthenticated().then((response) => {
            if (!response.isValid) {
                console.log("NOT AUTHENTICATED!");
                router.push("/login");
            }
        })
    }, [router, authenticationService]);

    return <>{children}</>
}