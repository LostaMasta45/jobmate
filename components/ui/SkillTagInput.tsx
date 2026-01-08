"use client";

import { useState, KeyboardEvent, useEffect } from "react";
import { X, Plus } from "lucide-react";

interface SkillTagInputProps {
    value: string[];
    onChange: (skills: string[]) => void;
    placeholder?: string;
    maxTags?: number;
}

export function SkillTagInput({
    value = [],
    onChange,
    placeholder = "Add a skill (e.g. precise, agile)...",
    maxTags = 20,
}: SkillTagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
            e.preventDefault();
            addTag(inputValue.trim());
        } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
            removeTag(value.length - 1);
        }
    };

    const addTag = (tag: string) => {
        const cleanTag = tag.replace(/,/g, "").trim();
        if (!cleanTag) return;

        if (value.some(v => v.toLowerCase() === cleanTag.toLowerCase())) {
            setInputValue("");
            return;
        }

        if (value.length >= maxTags) return;

        onChange([...value, cleanTag]);
        setInputValue("");
    };

    const removeTag = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    const handleBlur = () => {
        if (inputValue.trim()) {
            addTag(inputValue.trim());
        }
    };

    return (
        <div className="w-full space-y-2">
            <div className="flex flex-wrap gap-2 p-3 rounded-md border border-input bg-background focus-within:ring-1 focus-within:ring-ring transition-all">
                {value.map((tag, index) => (
                    <span
                        key={index}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm font-medium transition-all hover:bg-secondary/80"
                    >
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(index)}
                            className="text-muted-foreground hover:text-foreground focus:outline-none"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}

                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleBlur}
                    placeholder={value.length === 0 ? placeholder : ""}
                    className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1 placeholder:text-muted-foreground"
                    maxLength={30}
                />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground px-1">
                <span>Press Enter to add</span>
                <span>{value.length}/{maxTags}</span>
            </div>
        </div>
    );
}
