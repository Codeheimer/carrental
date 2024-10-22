'use client';

import { Button } from "../shadcn/button";

export interface ButtonDetails {
    label: string,
    type: "submit" | "reset" | "button",
    onClickAction?: React.MouseEventHandler<HTMLButtonElement>
}

export const createButtonDetails = (
    label: string,
    type: "submit" | "reset" | "button",
    onClickAction: React.MouseEventHandler<HTMLButtonElement> = () => { }): ButtonDetails => {
    return { label, type, onClickAction }
}

export default function GenericButton(details: ButtonDetails) {
    return (

        <div>
            <Button className="px-6 py-2 m-3 cursor-pointer transition-all" type={details.type} onClick={details.onClickAction}>
                {details.label}
            </Button>
        </div>
    )
}