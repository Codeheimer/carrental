export interface FilterField{
    label : string,
    name : string
}

export default function FilterInputField({ label }: { label: string }) {
    return (<div className="m-5 p-5">
        <label htmlFor="inputname" className="block text-gray-800 font-semibold text-sm">{label}</label>
        <div className="mt-2">
            <input
                type="text"
                name="inputname"
                className="block w-56 rounded-md py-1.5 px-2 ring-1 ring-inset ring-gray-400 focus:text-gray-800"
            />
        </div>
    </div>)
}