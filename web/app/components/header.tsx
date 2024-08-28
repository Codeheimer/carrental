import Link from "next/link";
import HeaderLink, { HeadLink } from "./header/headerLink";

export default function Header() {
    const links: HeadLink[] = [
        {label:"Home",path:"/"},
        {label:"Add Listing",path:"/vehicle/new"},
        {label:"Login",path:"/login"}
    ];
    return (<nav className="header flex justify-center items-center">
        {links.map((link,key) => 
            <HeaderLink key={key} label={link.label} path={link.path} />
        )}
    </nav>)
}