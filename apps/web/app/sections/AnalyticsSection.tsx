"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";

interface AnalyticsSectionProps {
  data?: any[];
}

export function AnalyticsSection({ data }: AnalyticsSectionProps) {
  const [analytics, setAnalytics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Default sample FRA dataset for fallback
  const defaultSampleData = [
    { magnitude: 0.95, phase: 1.05 },
    { magnitude: 1.02, phase: 0.98 },
    { magnitude: 0.87, phase: 1.12 },
    { magnitude: 1.10, phase: 0.90 },
    { magnitude: 0.99, phase: 1.00 },
    { magnitude: 1.05, phase: 0.95 },
  ];

  // Helper: generate dummy analytics from raw data
  const generateDummyAnalytics = (rawData: any[]) => {
    const sample = rawData.slice(0, 500);
    const avgMag = sample.reduce((sum, d) => sum + d.magnitude, 0) / sample.length;
    const avgPhase = sample.reduce((sum, d) => sum + d.phase, 0) / sample.length;
    const maxMag = Math.max(...sample.map((d) => d.magnitude));
    const minMag = Math.min(...sample.map((d) => d.magnitude));

    return [
      { faultType: "Core Deformation", magnitude: avgMag.toFixed(2), phase: (avgPhase*1.1).toFixed(2) },
      { faultType: "Winding Displacement", magnitude: (avgMag*0.85).toFixed(2), phase: (avgPhase*1.2).toFixed(2) },
      { faultType: "Shorted Turns", magnitude: maxMag.toFixed(2), phase: (avgPhase*0.95).toFixed(2) },
      { faultType: "Open Circuit", magnitude: minMag.toFixed(2), phase: (avgPhase*0.8).toFixed(2) },
    ];
  };

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);

      if (data && data.length > 0) {
        // 1️⃣ Use uploaded data to generate dummy analytics
        setAnalytics(generateDummyAnalytics(data));
      } else {
        // 2️⃣ Attempt API fetch
        try {
          const res = await fetch("/api/analytics");
          if (!res.ok) throw new Error("No live data available");
          const json = await res.json();

          if (json && json.length > 0) {
            setAnalytics(json);
          } else {
            // 3️⃣ API returned empty → fallback to default sample
            setAnalytics(generateDummyAnalytics(defaultSampleData));
          }
        } catch (err) {
          console.warn("Analytics fetch failed, using fallback dummy:", err);
          // 3️⃣ API fetch failed → fallback to default sample
          setAnalytics(generateDummyAnalytics(defaultSampleData));
        }
      }

      setLoading(false);
    };

    loadAnalytics();
  }, [data]);

  return (
    <Card className="mt-8">
      <CardHeader className="pb-2 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Fault Analytics Overview</CardTitle>
            <CardDescription>
              Insights generated from Frequency Response data
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        {loading ? (
          <div className="py-20">
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        ) : analytics && analytics.length > 0 ? (
          <ChartContainer
            config={{
              magnitude: { label: "Magnitude", color: "var(--chart-1)" },
              phase: { label: "Phase", color: "var(--chart-2)" },
            }}
            className="h-[280px] w-full"
          >
            <BarChart data={analytics} barCategoryGap="20%">
              <CartesianGrid vertical={false} />
              <XAxis dataKey="faultType" tickMargin={8} />
              <YAxis />
              <Tooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) => `Fault: ${label}`}
                  />
                }
              />
              <Legend />
              <Bar dataKey="magnitude" fill="var(--color-magnitude)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="phase" fill="var(--color-phase)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        ) : (
          <p className="text-center text-sm text-muted-foreground py-20">
            No analytics data available.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
