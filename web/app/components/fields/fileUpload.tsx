'use client';

import { ChangeEvent } from "react"
import { Field } from "./field"


export interface FileUploadDetails extends Field {
    onChangeEvent?: (event: ChangeEvent<HTMLInputElement>) => void,
}

export default function FileUpload(details: FileUploadDetails) {
    return (<div className="m-3">
        <label htmlFor={details.name} className="block text-gray-800 font-semibold text-sm"
        >{details.label}</label
        >
        <div className="mt-2">
            <input required={details.isRequired}
                type="file"
                name={details.name}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                onChange={details.onChangeEvent}
            />
        </div>
    </div>)
}