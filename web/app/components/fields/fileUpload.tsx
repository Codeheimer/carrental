'use client';

import { ChangeEvent } from "react"
import { Field } from "./field"
import { Input } from "../shadcn/input";


export interface IFileUploadDetails extends Field {
    multiple?: boolean
    onChangeEvent?: (event: ChangeEvent<HTMLInputElement>) => void
    classNames?: string
}

export class FileuploadDetails implements IFileUploadDetails {
    constructor(
        public label: string = "NO LABEL",
        public name: string = "NO NAME",
        public isRequired: boolean = false,
        public isHidden: boolean = false,
        public multiple: boolean = false,
        public onChangeEvent: (event: ChangeEvent<HTMLInputElement>) => void,
        public classNames: string = ""
    ) {

    }
}

export default function FileUpload(details: FileuploadDetails) {
    return (<div className="m-3">
        <label htmlFor={details.name} className="block font-semibold text-sm"
        >{details.label}</label
        >
        <div className="mt-2">
            <Input required={details.isRequired}
                type="file"
                multiple={details.multiple}
                name={details.name}
                title={details.label}
                className={`block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ${details.classNames}`}
                onChange={details.onChangeEvent}
            />
        </div>
    </div>)
}