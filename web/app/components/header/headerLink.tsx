import Link from "next/link";

export interface HeadLink {
    path : string
    label : string
}

export default function HeaderLink(headLink : HeadLink): JSX.Element {
    return (<div>
        <Link className="mx-1" href={headLink.path}>{headLink.label}</Link>
    </div>)
}