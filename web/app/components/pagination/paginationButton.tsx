
export interface PaginationButtonProps {
    children?: React.ReactElement,
    disabled?: boolean,
    onClick?: () => void
}

export default function PaginationButton({ children = <>{"Button"}</>, disabled, onClick }: PaginationButtonProps) {
    return (<button disabled={disabled}
        onClick={onClick}
        className={`
            flex 
            items-center 
            px-3 
            py-1 
            text-sm 
            font-medium 
            text-gray-700 
            border 
            border-gray-300 
            rounded-md 
        ${disabled ? 'bg-gray-200' : 'bg-white hover:bg-gray-200'}`}>
        {children}
    </button>)
}