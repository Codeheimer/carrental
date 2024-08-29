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
        const checkAuthenticated = async () => {
            const response = await authenticationService.isAuthenticated();
            if (!response) {
                console.log("NOT AUTHENTICATED!");
                router.push("/login");
            }
        }
        checkAuthenticated();
    }, [router, authenticationService]);

    return <>{children}</>
}