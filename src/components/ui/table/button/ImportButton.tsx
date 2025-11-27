import { UploadFile } from "@mui/icons-material";
import Button from "@mui/material/Button";
import { useRef, type ChangeEvent } from "react";

const ImportButton = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const selectedFile = useRef<File | null>(null);

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            selectedFile.current = file;
            console.log("File selected:", file.name);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                startIcon={<UploadFile />}
                onClick={handleButtonClick}
            >
                Import
            </Button>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".json"
                style={{ display: "none" }}
            />
        </>
    );
};

export default ImportButton;
