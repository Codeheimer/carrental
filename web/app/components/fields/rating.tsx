'use client';

import { Star } from "lucide-react";
import { forwardRef, useImperativeHandle, useState } from "react";
import { Field } from "./field";
export interface RatingDetails extends Field {
    value: number;
    onChange?: (value: number) => void;
}

export interface RatingRef {
    reset: () => void;
}

const Rating = forwardRef<RatingRef, RatingDetails>(function Rating({ value, onChange = (value: number) => { }, className, disabled = false }, ref) {
    const [hoveredIndex, setHoveredIndex] = useState<number>(-1);
    const [selectedIndex, setSelectedIndex] = useState<number>(value - 1);

    useImperativeHandle(ref, () => ({
        reset() {
            setSelectedIndex(-1);
            onChange(-1);
            setHoveredIndex(-1);
        },
    }));

    const handleMouseEnter = (index: number) => {
        if (disabled) {
            return;
        }
        setHoveredIndex(index);
    };

    const handleMouseLeave = () => {
        if (disabled) {
            return;
        }
        setHoveredIndex(-1);
    };

    const handleClick = (index: number): void => {
        if (disabled) {
            return;
        }
        if (selectedIndex === (index + 1)) {
            setSelectedIndex(-1);
            onChange(-1);
            setHoveredIndex(-1);
            return;
        }
        setSelectedIndex(index + 1)
        onChange(index + 1);
    };

    const getHighlightStar = (index: number, yellow: string = "text-yellow-400", grey: string = "text-gray-300"): string => {
        if (selectedIndex > 0) {
            return index < selectedIndex ? yellow : grey;
        }
        return hoveredIndex >= index ? yellow : grey;
    };

    return (
        <div className={`flex space-x-2 ${className}`}>
            {[...Array(5)].map((_, index) => (
                <Star
                    fill={getHighlightStar(index, "yellow", "")}
                    key={index}
                    className={`${!disabled && 'cursor-pointer'} transition-colors duration-300 ${getHighlightStar(index)}`}
                    size={24}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => handleClick(index)}
                />
            ))}
        </div>
    );
});

export default Rating;