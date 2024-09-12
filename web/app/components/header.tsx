'use client';

import useGlobalServiceStore from "../stores/globalServiceStore";
import HeaderLink, { HeadLink } from "./header/headerLink";
import GenericButton, { ButtonDetails } from "./fields/genericButton";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useAuthStore from "../stores/authStore";

export default function Header() {
    const defaultLinks: HeadLink[] = [
        { label: "Home", path: "/" },
        { label: "Add your Car", path: "/vehicle/new" }
    ];

    const [links, setLinks] = useState<HeadLink[]>([]);
    const { authenticationService } = useGlobalServiceStore();
    const router = useRouter();
    const loggedIn = useAuthStore((state) => state.loggedIn)
    const doLogout = useAuthStore((state) => state.logout);
    const login = useAuthStore((state) => state.login);

    useEffect(() => {
        initializeHeader();
    }, [loggedIn]);

    const initializeHeader = async () => {
        const response = await authenticationService.verifyToken();
        if (response.isValid) {
            console.log("Setting links with My Listings");
            setLinks([...defaultLinks, { label: "My Listings", path: "/admin/listings" }]);
            if (!loggedIn) {
                login();
            }
        } else {
            console.log("Setting default links");
            setLinks([...defaultLinks]);
            if (loggedIn) {
                doLogout();
            }
        }
    }

    const handleLogout = (): void => {
        console.log('removing login');
        authenticationService.clearToken();
        router.push("/")
        doLogout();
        initializeHeader();
    }

    const logout: ButtonDetails = {
        label: "Logout",
        type: "button",
        onClickAction: handleLogout
    }

    return (
        <nav className="z-50 bg-white sticky top-0 shadow-md flex items-center justify-between px-8 py-02">
            <nav className="nav font-semibold text-lg">
                <ul className="flex items-center">
                    {links.map((link, key) =>
                        <li key={key} className="p-4 border-b-2 border-gray-500 border-opacity-0 hover:border-opacity-100 hover:text-gray-500  duration-200 cursor-pointer active">
                            <HeaderLink label={link.label} path={link.path} />
                        </li>
                    )}
                </ul>
            </nav>

            <div className="w-3/12 flex justify-end">
                {loggedIn ? <form><GenericButton {...logout} /></form> : <HeaderLink label={'Login'} path={'/login'} />}
            </div>
        </nav>)
}