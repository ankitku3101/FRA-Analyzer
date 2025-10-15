"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const description = "Interactive FRA Graph";

const chartConfig = {
  magnitude: { label: "Magnitude (dB)", color: "var(--chart-1)" },
  phase: { label: "Phase (°)", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function Graphs({ data, loading }: { data?: any[]; loading?: boolean }) {
  const [chartData, setChartData] = useState<any[]>([]);
  const [csvPreview, setCsvPreview] = useState<string>("");
  const [timeRange, setTimeRange] = useState("all");

  // Load from /data.csv if no uploaded data provided
  useEffect(() => {
    if (data && data.length) {
      setChartData(data);
      return;
    }

    fetch("/data.csv")
      .then((res) => res.text())
      .then((csvText) => {
        setCsvPreview(csvText.split("\n").slice(0, 30).join("\n")); // show first 30 lines in modal
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

  const filteredData = React.useMemo(() => {
    if (!chartData.length) return [];
    if (timeRange === "all") return chartData;
    if (timeRange === "first100") return chartData.slice(0, 100);
    if (timeRange === "first500") return chartData.slice(0, 500);
    if (timeRange === "last100") return chartData.slice(-100);
    return chartData;
  }, [chartData, timeRange]);

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
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
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
              </AreaChart>
            </ChartContainer>
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
