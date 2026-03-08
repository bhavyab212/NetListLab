"use client";

import React, { useRef } from "react";
import { Image as ImageIcon, Upload } from "lucide-react";

interface ImageUploadInputProps {
    value: string;
    onChange: (url: string) => void;
    placeholder?: string;
    className?: string;
}

export default function ImageUploadInput({ value, onChange, placeholder = "Image URL or Upload…", className = "" }: ImageUploadInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                onChange(event.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="flex gap-2 w-full">
            <div className="relative flex-1 flex items-center">
                <ImageIcon size={16} className="absolute left-4 text-muted-foreground/50" />
                <input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={`pl-10 ${className} flex-1`}
                />
            </div>
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 h-12 flex items-center justify-center gap-2 rounded-2xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black tracking-widest uppercase hover:bg-primary/20 transition-all shrink-0"
            >
                <Upload size={16} /> Upload
            </button>
            <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </div>
    );
}
