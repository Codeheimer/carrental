import { ChangeEvent } from "react"
import { Field } from "./field"


export interface CheckboxDetails extends Field {
    onChangeEvent?: (event: ChangeEvent<HTMLInputElement>) => void,
}

export default function Checkbox(details: CheckboxDetails) {
    return (<div className="flex m-3">
        <div>
            <label htmlFor={details.name} className="block text-gray-800 font-semibold text-sm">{details.label}</label>
        </div>
        <div className="mx-3">
            <input required={details.isRequired}
                type="checkbox"
                name={details.name}
                className=""
                onChange={details.onChangeEvent} />
        </div>
    </div>)
}