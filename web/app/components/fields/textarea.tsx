'use client';
import { Field } from "./field"

export interface TextareaDetails extends Field {
    type?: string;
    rows?: number;
    column?: number;
}

export const createTextareaDetails = (
    label: string,
    name: string,
    isRequired: boolean = false,
    isHidden: boolean = false,
    rows: number = 10,
    column: number = 80
): TextareaDetails => {
    return { label, name, isRequired, isHidden, rows, column };
}

export default function Textarea(details: TextareaDetails) {
    return (<div className="m-3">
        <label htmlFor={details.name} className="block text-gray-800 font-semibold text-sm"
        >{details.label}</label
        >
        <div className="mt-2">
            <textarea required={details.isRequired}
                name={details.name}
                rows={details.rows}
                cols={details.column}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800" />
        </div>
    </div>)
}