'use client;'
import { useState } from "react";
import { Slider } from "../shadcn/slider";

export interface SliderProps {
    max: number,
    name: string,
    onValueChange?: (current: number[]) => void
}
export default function GenericSlider({ max = 100, name, onValueChange = (current: number[]) => { } }: SliderProps) {
    const [current, setCurrent] = useState<number[]>([0]);
    const handleCurrent = (newCurrent: number[]) => {
        setCurrent(newCurrent);
        onValueChange(newCurrent);
    }
    return (
        <div className="w-full p-4 space-y-1">
            <div className="relative w-full min-h-[20px]">
                <Slider
                    onValueChange={handleCurrent}
                    name={name}
                    value={current}
                    defaultValue={[max]}
                    max={max}
                    step={1}
                    className="w-full"
                />
            </div>
            <div className="text-sm text-muted-foreground">
                Selected: {current[0]}km
            </div>
        </div>
    )
}