import Link from "next/link";

export default function Header(){
    return (<nav className="header flex justify-center items-center">
    <Link className="mx-1" href="/">Home</Link>
    <Link className="mx-1" href="/vehicle/new">Add Listing</Link>
    </nav>)
}