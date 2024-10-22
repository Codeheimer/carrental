type IconType = 'first' | 'previous' | 'next' | 'last';

interface PaginationIconProps {
    type: IconType;
    size?: number;
    color?: string;
    strokeWidth?: number;
    className?: string;
}

export default function PaginationIcon({
    type,
    size = 28,
    color = "#000000",
    strokeWidth = 1.5,
    className = "",
}: PaginationIconProps) {
    const getPath = () => {
        switch (type) {
            case 'first':
                return (
                    <>
                        <path d="M8 6l-6 6l6 6" />
                        <path d="M19 6l-6 6l6 6" />
                    </>
                );
            case 'previous':
                return <path d="M15 6l-6 6l6 6" />;
            case 'next':
                return <path d="M9 6l6 6l-6 6" />;
            case 'last':
                return (
                    <>
                        <path d="M16 6l6 6l-6 6" />
                        <path d="M5 6l6 6l-6 6" />
                    </>
                );
        }
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`icon icon-tabler icon-tabler-chevron-${type} ${className}`}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            strokeWidth={strokeWidth}
            stroke={color}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            role="img"
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            {getPath()}
        </svg>
    );
}
