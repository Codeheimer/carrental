import { ChangeEvent } from "react"
import { Field } from "./field"
import { Input } from "../shadcn/input"
import { Checkbox } from "../shadcn/checkbox"


export interface CheckboxDetails extends Field {
    label: string,
    name: string,
    isRequired: boolean,
    isHidden: boolean,
    onChangeEvent?: (checked: boolean) => void,
}

export const createCheckboxDetails = (
    label: string,
    name: string,
    isRequired: boolean = false,
    isHidden: boolean = false,
    onChangeEvent: (checked: boolean) => void = (checked) => { }
): CheckboxDetails => {
    return { label, name, isRequired, isHidden, onChangeEvent };
}

export default function CheckBox(details: CheckboxDetails) {
    return (<div className="flex m-3">
        <label htmlFor={details.name} className="block font-semibold text-sm">{details.label}</label>
        <div className="mx-3">
            <Checkbox required={details.isRequired}
                name={details.name}
                onCheckedChange={details.onChangeEvent} />
        </div>
    </div>)
}