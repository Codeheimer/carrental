import { SelectTrigger } from "@radix-ui/react-select"
import { Select, SelectContent, SelectItem, SelectValue } from "../shadcn/select"
import { Field } from "./field"



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
            <Select name={details.name}>
                <SelectTrigger className="min-w-[180px]">
                    <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                    {details.options.map((option, key) => <SelectItem key={key} value={option.value}>{option.label}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    )
}