'use client';

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
    return (<button type={details.type} onClick={details.onClickAction} className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 m-3 rounded-lg
        border-blue-600">
        {details.label}
    </button>)
}