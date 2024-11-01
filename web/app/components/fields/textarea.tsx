'use client';
import { Textarea } from "../shadcn/textarea";
import { Field } from "./field"

export interface TextareaDetails extends Field {
    type?: string;
    rows?: number;
    column?: number;
    placeholder: string;
}

export const createTextareaDetails = (
    label: string,
    name: string,
    isRequired: boolean = false,
    isHidden: boolean = false,
    rows: number = 10,
    column: number = 80,
    placeholder: string = "Placeholder",
    className: string = "w-56"
): TextareaDetails => {
    return { label, name, isRequired, isHidden, rows, column, placeholder, className };
}

export default function TextArea(details: TextareaDetails) {
    return (<>
        <label htmlFor={details.name} className="my-4">{details.label}:</label>
        <Textarea required={details.isRequired}
            name={details.name}
            rows={details.rows}
            cols={details.column}
            placeholder={details.placeholder}
            className={`block rounded-md py-1.5 px-2 ring-1 ring-inset resize-none ${details.className}`}/>
    </>)
}