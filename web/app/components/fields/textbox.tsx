'use client';

import { ChangeEvent } from "react"
import { Field } from "./field"
import { Input } from "../shadcn/input";


export interface TextboxDetails extends Field {
    type?: string
    onChangeEvent?: (event: ChangeEvent<HTMLInputElement>) => void
}

export const createTextboxDetails = (
    label: string,
    name: string,
    isRequired: boolean = false,
    isHidden: boolean = false,
    type: string = "text",
    onChangeEvent: (event: ChangeEvent<HTMLInputElement>) => void = () => { }
): TextboxDetails => {
    return { label, name, isRequired, isHidden, type, onChangeEvent };
}

export default function Textbox(details: TextboxDetails) {
    return (<div className="m-3">
        <label htmlFor={details.name} className="block font-semibold text-sm"
        >{details.label}</label
        >
        <div className="mt-2">
            <Input required={details.isRequired}
                type={details.type || "text"}
                name={details.name}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset"
                onChange={details.onChangeEvent}
            />
        </div>
    </div>)
}