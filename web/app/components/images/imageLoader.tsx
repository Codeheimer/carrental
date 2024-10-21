import useAuthStore from "@/app/stores/authStore";
import useGlobalServiceStore from "@/app/stores/globalServiceStore";
import { createObjectURL } from "@/app/utilities/imageUtils";
import Image from "next/image";
import { ChangeEvent, MouseEventHandler, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function ImageLoader({ src, alt, className, objectFit = "cover", layout = "fill", ratio1to1 = false, onClickAction = () => { } }:
    { src: string, alt: string, className: string, objectFit?: string, layout?: string, ratio1to1?: boolean, onClickAction?: React.MouseEventHandler<HTMLImageElement> }) {
    const { resourceService } = useGlobalServiceStore();
    const { session } = useAuthStore();
    const [ref, inView] = useInView({ triggerOnce: true });
    const [imageSrc, setImageSrc] = useState('');

    useEffect(() => {
        if (inView) {
            resourceService.fetchImage(session.token, encodeURI(src))
                .then(response => setImageSrc(createObjectURL({ resource: response, type: "image/jpeg" })))
                .catch(error => console.error('Error loading image:', error));
        }
    }, [inView, src]);

    return (
        <div ref={ref} className={`${className} relative overflow-hidden`} style={{ aspectRatio: (ratio1to1 ? '1 / 1' : 'auto'), minHeight: '100px', minWidth: '100px' }} >
            {imageSrc && (
                <Image
                    onClick={onClickAction}
                    src={imageSrc}
                    alt={alt}
                    layout={layout}
                    objectFit={objectFit}
                    onLoad={() => URL.revokeObjectURL(imageSrc)}
                />
            )}
        </div>
    );
};