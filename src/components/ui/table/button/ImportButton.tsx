import { UploadFile } from "@mui/icons-material";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { useRef, useState, type ChangeEvent } from "react";
import { v7 as uuidv7 } from "uuid";
import { useNotification } from "../../../../notification/NotificationProvider";
import { useImport } from "../../../../entities/import/ImportContext";
import { ImportEntry } from "../../../../entities/import/ImportEntry";

const ImportButton = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const { success, error, info } = useNotification();
    const { addImport } = useImport();

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const importId = uuidv7();

        const file = event.target.files?.[0];
        if (file) {
            setIsUploading(true);
            setUploadProgress(0);

            const eventSource = new EventSource(
                `api/organizations/import/sse?importId=${importId}`,
                { withCredentials: false }
            );

            eventSource.addEventListener("IMPORT_STARTED", () => {
                setUploadProgress(10);
            });

            eventSource.addEventListener(
                "IMPORT_PROGRESS",
                (event: MessageEvent) => {
                    const data = JSON.parse(event.data);
                    const progress = 10 + (data.current / data.total) * 80;
                    setUploadProgress(Math.min(progress, 90));
                }
            );

            eventSource.addEventListener(
                "IMPORT_ERROR",
                (event: MessageEvent) => {
                    const err = JSON.parse(event.data);
                    setTimeout(() => {
                        error("Import failed", err);
                        setIsUploading(false);
                        setUploadProgress(0);
                    }, 100);
                    eventSource.close();
                }
            );

            eventSource.addEventListener("IMPORT_COMPLETED", () => {
                setUploadProgress(100);
                setTimeout(() => {
                    success("Import completed", "All items added");
                    setIsUploading(false);
                    setUploadProgress(0);
                }, 100);
                eventSource.close();
            });

            eventSource.addEventListener(
                "IMPORT_REVIEW",
                (event: MessageEvent) => {
                    const msg = JSON.parse(event.data);
                    info(
                        "Conflict resolution",
                        `Organization with full name ${msg} already exists. Conflict will be resolved by human moderator.`
                    );
                }
            );

            const formData = new FormData();
            formData.append("file", file);
            formData.append("importId", importId);

            fetch("api/organizations/import/json", {
                method: "POST",
                body: formData,
            })
                .then(async (response) => {
                    const responseData = await response.json();

                    const newImportEntry = new ImportEntry(
                        responseData.id,
                        responseData.createdAt,
                        responseData.userId,
                        responseData.total,
                        responseData.status
                    );

                    addImport(newImportEntry);
                })
                .catch((err) => {
                    error("Upload failed", err.message);
                    setIsUploading(false);
                    setUploadProgress(0);
                    eventSource.close();
                });
        }
        event.target.value = "";
    };

    return (
        <>
            <Box sx={{ position: "relative", display: "inline-flex" }}>
                <Button
                    variant="outlined"
                    startIcon={<UploadFile />}
                    onClick={handleButtonClick}
                    disabled={isUploading}
                    sx={{ minWidth: 120 }}
                >
                    {isUploading ? `${Math.round(uploadProgress)}%` : "Import"}
                </Button>
                {isUploading && (
                    <LinearProgress
                        variant="determinate"
                        value={uploadProgress}
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 3,
                            backgroundColor: "transparent",
                            "& .MuiLinearProgress-bar": {
                                backgroundColor: "primary.main",
                            },
                        }}
                    />
                )}
            </Box>
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
