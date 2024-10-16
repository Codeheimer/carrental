import { Button } from "../shadcn/button"

export interface PaginationButtonProps {
    children?: React.ReactElement,
    disabled?: boolean,
    onClick?: () => void
}

export default function PaginationButton({ children = <>{"Button"}</>, disabled, onClick }: PaginationButtonProps) {
    return (<Button disabled={disabled}
        onClick={onClick}
        className={`
            flex 
            items-center 
            px-3 
            py-1 
            text-sm 
            font-medium 
            border 
            rounded-md
            bg-background 
            text-foreground
            `}>
        {children}
    </Button>)
}