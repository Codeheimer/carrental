'use client';

import React, { useState } from "react";

export interface ErrorDetails {
    title: string,
    description: string,
    hasError(): boolean;
}

export class ErrorDetailsImpl implements ErrorDetails {
    title: string;
    description: string;

    constructor(title: string, description: string) {
        this.title = title;
        this.description = description;
    }

    hasError(): boolean {
        return this.title.length > 0 && this.description.length > 0;
    }
}

export const defaultErrorDetails: ErrorDetails = new ErrorDetailsImpl("", "");

const AlertError = React.forwardRef<HTMLDivElement, ErrorDetails>((details: ErrorDetails, ref) => {
    return (
        <div ref={ref} className="h-full flex-col w-64 m-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <div><strong className="m-1">{details.title}</strong></div>
            <div><span className="block sm:inline m-1">{details.description}</span></div>
        </div>
    )
}

);

AlertError.displayName = 'AlertError';

export default AlertError;