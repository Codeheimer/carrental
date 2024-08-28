import { ChangeEvent } from "react"


export interface TextboxDetails {
    label: string,
    type: string
    name: string,
    onChangeEvent: (event: ChangeEvent<HTMLInputElement>) => void,
    isRequired?: boolean
}

export default function Textbox(details: TextboxDetails) {
    return (<div>
        <label htmlFor={details.name} className="block text-gray-800 font-semibold text-sm"
        >{details.label}</label
        >
        <div className="mt-2">
            <input required={details.isRequired}
                type={details.type}
                name={details.name}
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
                onChange={details.onChangeEvent}
            />
        </div>
    </div>)
}