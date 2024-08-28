
export interface ErrorDetails {
    title : string,
    description : string
}

export const defaultErrorDetails : ErrorDetails = {
    title : "",
    description : ""
}

export default function AlertError(details : ErrorDetails) {
    return (
        <div className="h-full w-64 m-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold m-1">{details.title}</strong>
            <span className="block sm:inline m-1">{details.description}</span>
        </div>
    )
}