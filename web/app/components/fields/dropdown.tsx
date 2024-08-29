import { Field } from "./field"
import { TextboxDetails } from "./textbox"



export interface OptionDetails {
    value: string,
    label: string
}

export interface DropdownDetails extends Field {
    options: OptionDetails[],
    addBlank?: boolean
}

export default function Dropdown(details: DropdownDetails) {

    return (
        <div className="m-3 flex">
            <label className=" m-3 text-sm text-gray-900 cursor-pointer" htmlFor={details.name}>
                {details.label}
            </label>
            <select name={details.name} className="bg-gray-100 text-gray-900 border-0 rounded-md p-2 focus:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150">
                {details.addBlank && <option value={''}></option>}
                {details.options.map((option, key) => <option key={key} value={option.value}>{option.label}</option>)}
            </select>
        </div>
    )
}