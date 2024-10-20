'use client';

import useAuthStore from '@/app/stores/authStore';
import useGlobalServiceStore from '@/app/stores/globalServiceStore';
import { createObjectURL } from '@/app/utilities/imageUtils';
import Image from 'next/image';
import React, { useState, useEffect } from 'react';

export interface ImageModalProperties {
    open: boolean,
    handleClose: React.MouseEventHandler<HTMLButtonElement>,
    imageURL: string

}

export const defaultImageModalProperties: ImageModalProperties = { open: false, handleClose: () => { }, imageURL: "" }

export default function ImageModal(prop: ImageModalProperties) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { resourceService } = useGlobalServiceStore();
    const { session } = useAuthStore();

    useEffect(() => {
        const fetchImage = async () => {
            if (prop.open && prop.imageURL && session.token) {
                setLoading(true);
                setError(null);

                const response = await resourceService.fetchImage(session.token, encodeURI(prop.imageURL));
                const url = createObjectURL({ resource: response, type: "image/jpeg" });
                setImageUrl(url);
                setLoading(false);

            }
        }

        fetchImage();

        return () => {
            if (imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    }, [prop.open, prop.imageURL]);

    return (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-background border border-gray-200 p-4 rounded-lg max-w-3xl w-full mx-4">
                <div className="flex justify-end">
                    <button
                        onClick={prop.handleClose}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mt-4">
                    {loading && (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                        </div>
                    )}
                    {error && <p className="text-red-500 text-center">{error}</p>}


                    {!loading && !error && imageUrl && (
                        <Image width={'1000'} height={'1000'} src={imageUrl} alt={prop.imageURL} className="max-w-full max-h-[80vh] mx-auto object-contain" />
                    )}
                </div>
            </div>
        </div>
    );
};
