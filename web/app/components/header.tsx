'use client';

import useGlobalServiceStore from "../stores/globalServiceStore";
import HeaderLink from "./header/headerLink";
import GenericButton, { ButtonDetails } from "./fields/genericButton";
import { useRouter } from "next/navigation";
import useAuthStore from "../stores/authStore";

export default function Header() {
    const { authenticationService } = useGlobalServiceStore();
    const router = useRouter();
    const session = useAuthStore((state) => state.session);
    const doLogout = useAuthStore((state) => state.logout);

    const handleLogout = (): void => {
        authenticationService.clearToken();
        doLogout();
        router.push("/")
        router.refresh()
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
                    {session.headerLinks.map((link, key) =>
                        <li key={key} className="p-4 border-b-2 border-gray-500 border-opacity-0 hover:border-opacity-100 hover:text-gray-500  duration-200 cursor-pointer active">
                            <HeaderLink label={link.label} path={link.path} />
                        </li>
                    )}
                </ul>
            </nav>

            <div className="w-3/12 flex justify-end">
                USER ID: {session.userId}
                {session.loggedIn ? <form><GenericButton {...logout} /></form> : <HeaderLink label={'Login'} path={'/login'} />}
            </div>
        </nav>)
}