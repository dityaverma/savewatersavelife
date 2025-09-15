"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { TrendingUp, TrendingDown, Calendar, BarChart3, Download, Filter } from "lucide-react"

// Mock trend data
const trendData = [
  { month: "Jan 2024", hpi: 45.2, lead: 0.08, cadmium: 0.004, samples: 12 },
  { month: "Feb 2024", hpi: 52.1, lead: 0.095, cadmium: 0.0045, samples: 15 },
  { month: "Mar 2024", hpi: 48.7, lead: 0.087, cadmium: 0.0041, samples: 18 },
  { month: "Apr 2024", hpi: 61.3, lead: 0.112, cadmium: 0.0052, samples: 14 },
  { month: "May 2024", hpi: 58.9, lead: 0.105, cadmium: 0.0048, samples: 16 },
  { month: "Jun 2024", hpi: 67.4, lead: 0.125, cadmium: 0.0058, samples: 20 },
  { month: "Jul 2024", hpi: 72.1, lead: 0.138, cadmium: 0.0063, samples: 22 },
  { month: "Aug 2024", hpi: 69.8, lead: 0.132, cadmium: 0.0061, samples: 19 },
  { month: "Sep 2024", hpi: 74.5, lead: 0.145, cadmium: 0.0067, samples: 25 },
  { month: "Oct 2024", hpi: 78.2, lead: 0.152, cadmium: 0.0071, samples: 23 },
  { month: "Nov 2024", hpi: 81.7, lead: 0.163, cadmium: 0.0075, samples: 21 },
  { month: "Dec 2024", hpi: 85.3, lead: 0.171, cadmium: 0.0079, samples: 18 },
]

const seasonalData = [
  { season: "Spring", avgHPI: 54.0, trend: "increasing" },
  { season: "Summer", avgHPI: 69.8, trend: "peak" },
  { season: "Fall", avgHPI: 78.1, trend: "increasing" },
  { season: "Winter", avgHPI: 65.8, trend: "decreasing" },
]

export default function TrendsPage() {
  const [selectedParameter, setSelectedParameter] = useState("hpi")
  const [timeRange, setTimeRange] = useState("12months")
  const [viewType, setViewType] = useState("line")

  const getParameterData = (data: any[], parameter: string) => {
    return data.map((item) => ({
      ...item,
      value: item[parameter],
    }))
  }

  const calculateTrend = (data: number[]) => {
    if (data.length < 2) return 0
    const firstHalf = data.slice(0, Math.floor(data.length / 2))
    const secondHalf = data.slice(Math.floor(data.length / 2))
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length
    return ((secondAvg - firstAvg) / firstAvg) * 100
  }

  const hpiTrend = calculateTrend(trendData.map((d) => d.hpi))
  const leadTrend = calculateTrend(trendData.map((d) => d.lead))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trend Analysis</h1>
          <p className="text-muted-foreground">Temporal variation and pattern analysis of groundwater contamination</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Trends
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Analysis Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Parameter</label>
              <Select value={selectedParameter} onValueChange={setSelectedParameter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hpi">HPI Index</SelectItem>
                  <SelectItem value="lead">Lead (Pb)</SelectItem>
                  <SelectItem value="cadmium">Cadmium (Cd)</SelectItem>
                  <SelectItem value="samples">Sample Count</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="12months">Last 12 Months</SelectItem>
                  <SelectItem value="24months">Last 24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Chart Type</label>
              <Select value={viewType} onValueChange={setViewType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HPI Trend</CardTitle>
            {hpiTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${hpiTrend > 0 ? "text-destructive" : "text-green-600"}`}>
              {hpiTrend > 0 ? "+" : ""}
              {hpiTrend.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">6-month change</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Trend</CardTitle>
            {leadTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${leadTrend > 0 ? "text-destructive" : "text-green-600"}`}>
              {leadTrend > 0 ? "+" : ""}
              {leadTrend.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">6-month change</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Peak Season</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Summer</div>
            <p className="text-xs text-muted-foreground">Highest contamination</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">223</div>
            <p className="text-xs text-muted-foreground">Last 12 months</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>{selectedParameter.toUpperCase()} Temporal Variation</CardTitle>
          <CardDescription>
            Monthly trends showing {selectedParameter === "hpi" ? "pollution index" : "concentration"} changes over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              {viewType === "line" ? (
                <LineChart data={getParameterData(trendData, selectedParameter)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              ) : (
                <BarChart data={getParameterData(trendData, selectedParameter)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="hsl(var(--primary))" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Seasonal Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Seasonal Patterns</CardTitle>
            <CardDescription>Average contamination levels by season</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {seasonalData.map((season) => (
                <div key={season.season} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-medium">{season.season}</div>
                    <Badge
                      variant={
                        season.trend === "peak"
                          ? "destructive"
                          : season.trend === "increasing"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {season.trend}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{season.avgHPI}</div>
                    <div className="text-xs text-muted-foreground">Avg HPI</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>Automated trend analysis findings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-destructive" />
                  <span className="font-medium text-destructive">Increasing Trend</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  HPI values have increased by 88.6% over the past 12 months, indicating worsening contamination.
                </p>
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Seasonal Pattern</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Summer months show consistently higher contamination levels, possibly due to increased industrial
                  activity.
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">Sample Coverage</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Sampling frequency has increased, providing better data coverage for trend analysis.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
