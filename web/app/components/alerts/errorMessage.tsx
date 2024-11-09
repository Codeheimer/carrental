import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../shadcn/alert";
import { forwardRef } from "react";

export interface ErrorDetails {
    title: string,
    message: string
}

const ErrorMessage = forwardRef<HTMLDivElement, ErrorDetails>(
    ({ title, message }, ref) => {
        const CLASSES = "dark:border-red-300 dark:text-red-300";

        return (
            <Alert
                ref={ref}
                variant="destructive"
                className={`border-red-500 ${CLASSES}`}
            >
                <AlertTriangle className={`h-4 w-4 ${CLASSES}`} />
                <AlertTitle>{title}</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        );
    }
);

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;