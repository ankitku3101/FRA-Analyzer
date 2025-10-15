"use client";

import { File, FileSpreadsheet, X } from "lucide-react";
import { ChangeEvent, DragEvent, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type Props = {
  apiBaseUrl: string;
  onUploadComplete?: (data: any) => void;
};

export default function FileUpload({ apiBaseUrl, onUploadComplete }: Props) {
  const [uploadState, setUploadState] = useState<{
    file: File | null;
    progress: number;
    uploading: boolean;
    uploadComplete: boolean;
  }>({
    file: null,
    progress: 0,
    uploading: false,
    uploadComplete: false,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  const validFileTypes = [
    "text/csv",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  const uploadToServer = (file: File) => {
    const url = `${apiBaseUrl.replace(/\/$/, "")}/upload`;
    const form = new FormData();
    form.append("file", file);

    const xhr = new XMLHttpRequest();
    xhrRef.current = xhr;

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadState((prev) => ({ ...prev, progress: percent }));
      }
    };

    xhr.onload = () => {
      xhrRef.current = null;
      if (xhr.status >= 200 && xhr.status < 300) {
        const responseData = JSON.parse(xhr.responseText);
        setUploadState((prev) => ({
          ...prev,
          progress: 100,
          uploading: false,
          uploadComplete: true,
        }));
        toast.success("File uploaded successfully", {
          position: "bottom-right",
          duration: 3000,
        });
        if (onUploadComplete) onUploadComplete(responseData);
      } else {
        setUploadState((prev) => ({
          ...prev,
          progress: 0,
          uploading: false,
          uploadComplete: false,
        }));
        toast.error("Upload failed", {
          position: "bottom-right",
          duration: 3000,
        });
      }
    };

    xhr.onerror = () => {
      xhrRef.current = null;
      setUploadState((prev) => ({
        ...prev,
        progress: 0,
        uploading: false,
        uploadComplete: false,
      }));
      toast.error("Network error during upload", {
        position: "bottom-right",
        duration: 3000,
      });
    };

    xhr.open("POST", url);
    xhr.send(form);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (!validFileTypes.includes(file.type)) {
      toast.error("Please upload a CSV, XLSX, or XLS file.", {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("File exceeds maximum size of 10MB.", {
        position: "bottom-right",
        duration: 3000,
      });
      return;
    }

    setUploadState({ file, progress: 0, uploading: false, uploadComplete: false });
  };

  const handleUpload = () => {
    if (!file || uploading || uploadComplete) return;

    setUploadState((prev) => ({ ...prev, uploading: true, progress: 0 }));
    uploadToServer(file);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleFile(event.dataTransfer.files?.[0]);
  };

  const resetFile = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setUploadState({ file: null, progress: 0, uploading: false, uploadComplete: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getFileIcon = () => {
    if (!uploadState.file) return <File />;
    const ext = uploadState.file.name.split(".").pop()?.toLowerCase();
    return ["csv", "xlsx", "xls"].includes(ext || "") ? (
      <FileSpreadsheet className="h-5 w-5 text-foreground" />
    ) : (
      <File className="h-5 w-5 text-foreground" />
    );
  };

  const { file, progress, uploading, uploadComplete } = uploadState;

  return (
    <div className="flex items-center justify-center p-10 w-full max-w-lg">
      <form className="w-full" onSubmit={(e) => e.preventDefault()}>
        <h3 className="text-lg font-semibold text-foreground">File Upload</h3>

        <div
          className="flex justify-center rounded-md border mt-2 border-dashed border-input px-6 py-12"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div>
            <File className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden={true} />
            <div className="flex text-sm leading-6 text-muted-foreground">
              <p>Drag and drop or</p>
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-sm pl-1 font-medium text-primary hover:underline hover:underline-offset-4"
              >
                <span>choose file</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
              <p className="pl-1">to upload</p>
            </div>
          </div>
        </div>

        <p className="mt-2 text-xs leading-5 text-muted-foreground sm:flex sm:items-center sm:justify-between">
          <span>Accepted file types: CSV, XLSX or other binaries.</span>
        </p>

        {file && (
          <Card className="relative mt-8 bg-muted p-4 space-y-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
              aria-label="Remove"
              onClick={resetFile}
            >
              <X className="h-5 w-5 shrink-0" aria-hidden={true} />
            </Button>

            <div className="flex items-center space-x-2.5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-background shadow-sm ring-1 ring-inset ring-border">
                {getFileIcon()}
              </span>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{file.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                  {uploadComplete && (
                    <span className="ml-2 text-primary font-medium">✓ Uploaded</span>
                  )}
                </p>
              </div>
            </div>

            {(uploading || uploadComplete) && (
              <div className="flex items-center space-x-3">
                <Progress value={progress} className="h-1.5" />
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
            )}
          </Card>
        )}

        <div className="mt-8 flex items-center justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={resetFile}
            disabled={!file}
          >
            {uploadComplete ? "Clear" : "Cancel"}
          </Button>
          <Button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading || uploadComplete}
          >
            {uploading ? "Uploading..." : uploadComplete ? "Uploaded" : "Upload"}
          </Button>
        </div>
      </form>
    </div>
  );
}
