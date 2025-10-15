"use client";

import { CheckCircle2, Clock, File, FileSpreadsheet, X } from "lucide-react";
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
        toast.success("File uploaded successfully", { position: "bottom-right", duration: 3000 });
        if (onUploadComplete) onUploadComplete(responseData);
      } else {
        setUploadState((prev) => ({
          ...prev,
          progress: 0,
          uploading: false,
          uploadComplete: false,
        }));
        toast.error("Upload failed", { position: "bottom-right", duration: 3000 });
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
      toast.error("Network error during upload", { position: "bottom-right", duration: 3000 });
    };

    xhr.open("POST", url);
    xhr.send(form);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    if (!validFileTypes.includes(file.type)) {
      toast.error("Please upload a CSV, XLSX, or XLS file.", { position: "bottom-right", duration: 3000 });
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("File exceeds maximum size of 10MB.", { position: "bottom-right", duration: 3000 });
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
    if (fileInputRef.current) fileInputRef.current.value = "";
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
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-4xl mx-auto space-y-8">
      <h3 className="text-xl font-semibold text-foreground text-center">Upload Your File</h3>

      {/* File types cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Card 1: Currently Supported */}
      <Card className="p-4">
        {/* The mb-1.5 class was removed from this div */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            Currently Supported
          </p>
          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
        </div>
        <div className="flex flex-wrap gap-1 mt-1"> {/* Added mt-1 for a tiny bit of breathing room */}
          <span className="font-mono text-[10px] leading-tight bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground">
            .csv
          </span>
          <span className="font-mono text-[10px] leading-tight bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground">
            .xls, .xlsx
          </span>
        </div>
      </Card>

      {/* Card 2: Coming Soon */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-foreground">
            Coming Soon <span className="text-xs text-muted-foreground">(Omicron, Doble, Megger etc.)</span>
          </p>
          <Clock className="h-4 w-4 text-blue-500 flex-shrink-0" />
        </div>
        <div className="flex flex-wrap gap-1 mt-1"> 
          <span className="font-mono text-[10px] leading-tight bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground">.fra</span>
          <span className="font-mono text-[10px] leading-tight bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground">.fda</span>
          <span className="font-mono text-[10px] leading-tight bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground">.sfra</span>
          <span className="font-mono text-[10px] leading-tight bg-muted px-1.5 py-0.5 rounded-sm text-muted-foreground">and more..</span>
        </div>
      </Card>
    </div>

      {/* Drag and drop area */}
      <div
        className="flex justify-center items-center rounded-lg border-2 border-dashed border-input w-full h-48 bg-background hover:bg-muted transition-colors duration-150 cursor-pointer"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="text-center">
          <File className="mx-auto h-14 w-14 text-muted-foreground mb-3" aria-hidden={true} />
          <p className="text-sm text-muted-foreground">
            Drag & drop your file here, or{" "}
            <span className="text-primary font-medium underline underline-offset-2 cursor-pointer">choose file</span>
          </p>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </div>
      </div>

      {/* Uploaded file preview */}
      {file && (
        <Card className="relative w-full bg-muted p-4 space-y-4 border border-input">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8 text-muted-foreground hover:text-foreground"
            aria-label="Remove"
            onClick={resetFile}
          >
            <X className="h-5 w-5 shrink-0" aria-hidden={true} />
          </Button>

          <div className="flex items-center space-x-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-md bg-background shadow-sm ring-1 ring-inset ring-border">
              {getFileIcon()}
            </span>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{file.name}</p>
              <p className="text-xs text-muted-foreground">
                {(file.size / 1024 / 1024).toFixed(2)} MB
                {uploadComplete && <span className="ml-2 text-primary font-medium">✓ Uploaded</span>}
              </p>
            </div>
          </div>

          {(uploading || uploadComplete) && (
            <div className="flex items-center space-x-3">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground">{progress}%</span>
            </div>
          )}
        </Card>
      )}

      {/* Buttons */}
      <div className="flex justify-end w-full space-x-3">
        <Button type="button" variant="outline" onClick={resetFile} disabled={!file}>
          {uploadComplete ? "Clear" : "Cancel"}
        </Button>
        <Button type="button" onClick={handleUpload} disabled={!file || uploading || uploadComplete}>
          {uploading ? "Uploading..." : uploadComplete ? "Uploaded" : "Upload"}
        </Button>
      </div>
    </div>
  );
}
