"use client";

import { useState } from "react";
import FileUpload from "@/components/file-upload";
import { Graphs } from "./Graphs";
import { AnalyticsSection } from "./AnalyticsSection";

const Hero = () => {
  const [uploadedData, setUploadedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUploadComplete = async (responseData: any) => {
    try {
      setLoading(true);
      // If backend returns data directly:
      if (responseData?.data) {
        setUploadedData(responseData.data);
      }
      // Or if backend returns file ID:
      else if (responseData?.fileId) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/analyze/${responseData.fileId}`);
        const json = await res.json();
        setUploadedData(json);
      }
    } catch (error) {
      console.error("Error loading graph data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-32 flex flex-col items-center justify-center">
      <div className="container relative z-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center">
          <div className="flex flex-col items-center gap-6 text-center px-4 sm:px-6 md:px-8">
            <div className="w-full max-w-3xl">
              <h1 className="text-primary font-bold tracking-tight mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
                FRA-Analyzer
              </h1>
              <h2 className="text-pretty font-bold tracking-tight mb-4 text-lg sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
                AI-Powered Transformer Diagnostics
              </h2>
            <p className="text-muted-foreground/70 mx-auto max-w-2xl text-sm sm:text-base md:text-lg lg:text-xl">
                Analyze transformer faults using{" "}
                <span className="text-primary font-semibold">Frequency Response Analysis</span>{" "}
                and view detailed AI-driven insights with predictive recommendations.
            </p>
            </div>
          </div>

          <FileUpload
            apiBaseUrl={process.env.NEXT_PUBLIC_API_URL ?? ""}
            onUploadComplete={handleUploadComplete}
          />
        </div>

        <div className="mt-16">
          <Graphs data={uploadedData} loading={loading} />
          <AnalyticsSection data={uploadedData} />
        </div>
      </div>
    </section>
  );
};

export { Hero };
