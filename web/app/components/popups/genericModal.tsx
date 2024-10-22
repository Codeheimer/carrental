import { ReactNode, useEffect } from "react";

export interface ModalProp {
    onClose: () => void
    isOpen?: boolean
    children?: ReactNode
    onLoad?: () => void
    cleanup?: () => void
    dependencies?: any[]
}

export const initialModal: ModalProp = { onClose: () => { }, isOpen: false };

export default function GenericModal({ onClose, isOpen, children, onLoad, cleanup, dependencies = [isOpen, onClose] }: ModalProp) {
    useEffect(() => {
        if (onLoad)
            onLoad();

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            return () => document.removeEventListener('keydown', handleEscape);
        }
        return cleanup;
    }, dependencies);

    if (!isOpen) return null;

    // Handle click outside
    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" onClick={handleBackdropClick}>
            <div className="bg-background text-foreground border border-gray-200 p-4 rounded-lg max-w-3xl w-full mx-4">
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mt-4">
                    {children}
                </div>
            </div>
        </div>
    )
}