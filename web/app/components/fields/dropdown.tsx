import { SelectTrigger } from "@radix-ui/react-select"
import { Select, SelectContent, SelectItem, SelectValue } from "../shadcn/select"
import { Field } from "./field"

export interface OptionDetails {
    value: string,
    label: string
}

export interface DropdownDetails extends Field {
    options: OptionDetails[],
    onValueChange?: (current: string) => void,
    value?: string
}

export default function Dropdown(details: DropdownDetails) {

    return (
        <div className="m-3 flex">
            <Select name={details.name} defaultValue="" onValueChange={details.onValueChange} value={details.value}>
                <SelectTrigger className="min-w-[220px] bg-background text-foreground border border-solid border-gray-400 rounded m-2 p-2">
                    <SelectValue placeholder={details.label} />
                </SelectTrigger>
                <SelectContent>
                    {details.options.map((option, key) => <SelectItem key={key} value={option.value}>{option.label}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
    )
}