import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Course } from "@/App";

type Props = {
    onUploadComplete: (coursesTaken: Course[], coursesNotYetTaken: Course[]) => void;
};

export const TranscriptUploader: React.FC<Props> = ({ onUploadComplete }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [status, setStatus] = useState<string | null>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const coursesTaken = res.data.courses_taken;
            const coursesNotYetTaken = res.data.courses_not_yet_taken;

            onUploadComplete(coursesTaken, coursesNotYetTaken); // Send data to App.tsx
            setStatus(null);
        } catch (error) {
            console.error("Upload failed", error);
            setStatus("Failed to upload transcript.");
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="flex flex-col items-center gap-6">
            {/* Hidden file input */}
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />

            {/* Visible trigger button */}
            <Button onClick={handleClick} className="cursor-pointer">Upload Transcript</Button>

            {status && <p className="text-muted-foreground text-sm">{status}</p>}
        </div>
    );
};