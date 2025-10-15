"use client";

import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import { AreaChart, Area, CartesianGrid, XAxis, YAxis, Brush } from "recharts";
import Papa from "papaparse";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "Interactive FRA Graph with zoom & pan";

const chartConfig = {
  magnitude: { label: "Magnitude (dB)", color: "var(--chart-1)" },
  phase: { label: "Phase (°)", color: "var(--chart-2)" },
};

export function Graphs({ data, loading }: { data?: any[]; loading?: boolean }) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [csvPreview, setCsvPreview] = useState<string>("");
  const [timeRange, setTimeRange] = useState("all");

  // Vertical zoom state
  const [yDomain, setYDomain] = useState<[number, number] | undefined>(undefined);

  // Load CSV sample if no uploaded data
  useEffect(() => {
    if (data && data.length) {
      setChartData(data);
      return;
    }

    fetch("/data.csv")
      .then((res) => res.text())
      .then((csvText) => {
        setCsvPreview(csvText.split("\n").slice(0, 30).join("\n"));
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const formatted = (parsed.data as any[])
          .filter((row) => row["Freq."] && row["V(e1)/I(V1)"])
          .map((row) => {
            const freq = parseFloat(row["Freq."]);
            const imp = row["V(e1)/I(V1)"];
            const magnitude = parseFloat(imp.match(/\(([0-9.e+-]+)dB/)?.[1] || "0");
            const phase = parseFloat(imp.match(/,([0-9.e+-]+)/)?.[1] || "0");
            return { frequency: freq, magnitude, phase };
          });
        setChartData(formatted);
      })
      .catch((err) => console.error("Failed to load CSV:", err));
  }, [data]);

  // Filtered subset of data
  const filteredData = useMemo(() => {
    if (!chartData.length) return [];
    switch (timeRange) {
      case "first100": return chartData.slice(0, 100);
      case "first500": return chartData.slice(0, 500);
      case "last100": return chartData.slice(-100);
      default: return chartData;
    }
  }, [chartData, timeRange]);

  // Handle mouse wheel for vertical zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (!filteredData.length) return;
    e.preventDefault();
    const allValues = filteredData.flatMap(d => [d.magnitude, d.phase]);
    const [min, max] = yDomain || [Math.min(...allValues), Math.max(...allValues)];
    const delta = (max - min) * 0.1 * (e.deltaY > 0 ? 1 : -1); // zoom factor
    const newMin = min + delta / 2;
    const newMax = max - delta / 2;
    setYDomain([newMin, newMax]);
  };

  return (
    <div className="space-y-4">
      {/* Info Card with Dialog */}
      <Card className="border-dashed border-muted bg-muted/30 p-3 sm:p-4">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-base font-medium mb-0">
                Sample Data in Use
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                This chart uses a sample dataset (<code>data.csv</code>) for demonstration.
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="ml-2">
                  View Data
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl p-0">
                <DialogHeader className="px-4 py-3">
                  <DialogTitle>Sample Data Preview (data.csv)</DialogTitle>
                </DialogHeader>
                <div className="max-h-[400px] overflow-auto rounded-b-md bg-muted p-4 text-sm font-mono whitespace-pre-wrap">
                  {csvPreview || "Loading sample data..."}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Main Chart */}
      <Card className="pt-0">
        <CardHeader className="flex items-center gap-2 border-b py-5 sm:flex-row">
          <div className="grid flex-1 gap-1">
            <CardTitle>Frequency Response Overview</CardTitle>
            <CardDescription>
              Showing magnitude & phase ({chartData.length} points)
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px]" aria-label="Select range">
              <SelectValue placeholder="All data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All data</SelectItem>
              <SelectItem value="first100">First 100</SelectItem>
              <SelectItem value="first500">First 500</SelectItem>
              <SelectItem value="last100">Last 100</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
          {loading ? (
            <p className="text-center text-muted-foreground py-20">
              Processing uploaded data...
            </p>
          ) : filteredData.length > 0 ? (
            <div onWheel={handleWheel}>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <AreaChart data={filteredData}>
                  <defs>
                    <linearGradient id="fillMagnitude" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-magnitude)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-magnitude)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillPhase" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-phase)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-phase)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="frequency"
                    tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                    tickMargin={8}
                  />
                  <YAxis domain={yDomain} />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        labelFormatter={(v) => `${Number(v).toFixed(2)} Hz`}
                        indicator="dot"
                      />
                    }
                  />
                  <Area
                    dataKey="phase"
                    type="natural"
                    fill="url(#fillPhase)"
                    stroke="var(--color-phase)"
                  />
                  <Area
                    dataKey="magnitude"
                    type="natural"
                    fill="url(#fillMagnitude)"
                    stroke="var(--color-magnitude)"
                  />
                  <ChartLegend content={<ChartLegendContent />} />

                  {/* Horizontal zoom/scroll */}
                  <Brush
                    dataKey="frequency"
                    height={30}
                    stroke="var(--chart-1)"
                    fill="var(--muted)"             
                    traveller={({
                        style: {
                        border: `2px solid var(--primary-500)`, 
                        backgroundColor: "var(--primary-100)"  
                        }
                    } as any)}
                    startIndex={0}
                    endIndex={Math.min(100, filteredData.length - 1)}
                    tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
                    />
                </AreaChart>
              </ChartContainer>
            </div>
          ) : (
            <p className="text-center text-sm text-destructive py-20">
              No valid data found.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
