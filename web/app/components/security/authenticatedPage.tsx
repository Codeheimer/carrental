import { isAuthenticated } from "@/app/services/authenticationService";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface AuthenticatedRouteProps {
    children: ReactNode
}

export default function AuthenticatedPage({ children }: AuthenticatedRouteProps): JSX.Element {
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
        }
    }, [router]);

    return <>{children}</>
}