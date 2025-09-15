"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { GitCompare, Download } from "lucide-react"

// Mock comparison datasets
const datasets = [
  {
    id: "dataset1",
    name: "Industrial Zone A",
    samples: 45,
    avgHPI: 78.5,
    riskLevel: "High",
    date: "2024-01-15",
    metals: {
      lead: 0.15,
      cadmium: 0.008,
      chromium: 0.12,
      copper: 1.8,
      zinc: 2.1,
      iron: 0.8,
      manganese: 0.3,
      nickel: 0.09,
    },
  },
  {
    id: "dataset2",
    name: "Agricultural Area B",
    samples: 32,
    avgHPI: 42.3,
    riskLevel: "Moderate",
    date: "2024-01-20",
    metals: {
      lead: 0.06,
      cadmium: 0.003,
      chromium: 0.04,
      copper: 0.8,
      zinc: 1.2,
      iron: 0.4,
      manganese: 0.15,
      nickel: 0.03,
    },
  },
  {
    id: "dataset3",
    name: "Residential Zone C",
    samples: 28,
    avgHPI: 25.7,
    riskLevel: "Low",
    date: "2024-01-25",
    metals: {
      lead: 0.02,
      cadmium: 0.001,
      chromium: 0.02,
      copper: 0.3,
      zinc: 0.8,
      iron: 0.2,
      manganese: 0.08,
      nickel: 0.01,
    },
  },
]

export default function ComparisonPage() {
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>(["dataset1", "dataset2"])
  const [comparisonType, setComparisonType] = useState("metals")

  const getSelectedData = () => {
    return datasets.filter((d) => selectedDatasets.includes(d.id))
  }

  const getComparisonData = () => {
    const selected = getSelectedData()
    if (comparisonType === "metals") {
      const metals = ["lead", "cadmium", "chromium", "copper", "zinc", "iron", "manganese", "nickel"]
      return metals.map((metal) => {
        const dataPoint: any = { metal: metal.charAt(0).toUpperCase() + metal.slice(1) }
        selected.forEach((dataset) => {
          dataPoint[dataset.name] = dataset.metals[metal as keyof typeof dataset.metals]
        })
        return dataPoint
      })
    } else {
      return selected.map((dataset) => ({
        name: dataset.name,
        HPI: dataset.avgHPI,
        samples: dataset.samples,
        riskScore:
          dataset.riskLevel === "Low" ? 1 : dataset.riskLevel === "Moderate" ? 2 : dataset.riskLevel === "High" ? 3 : 4,
      }))
    }
  }

  const getRadarData = () => {
    const selected = getSelectedData()
    const metals = ["lead", "cadmium", "chromium", "copper", "zinc", "iron", "manganese", "nickel"]
    return metals.map((metal) => {
      const dataPoint: any = {
        metal: metal.charAt(0).toUpperCase() + metal.slice(1),
        fullMark: 1.0,
      }
      selected.forEach((dataset) => {
        dataPoint[dataset.name] = dataset.metals[metal as keyof typeof dataset.metals]
      })
      return dataPoint
    })
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-orange-100 text-orange-800"
      case "Critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const toggleDataset = (datasetId: string) => {
    setSelectedDatasets((prev) =>
      prev.includes(datasetId) ? prev.filter((id) => id !== datasetId) : [...prev, datasetId],
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dataset Comparison</h1>
          <p className="text-muted-foreground">
            Compare contamination levels across different sampling locations and time periods
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Comparison
          </Button>
        </div>
      </div>

      {/* Dataset Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Select Datasets to Compare
          </CardTitle>
          <CardDescription>Choose up to 4 datasets for comparative analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {datasets.map((dataset) => (
              <div
                key={dataset.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedDatasets.includes(dataset.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => toggleDataset(dataset.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{dataset.name}</h4>
                  <Badge className={getRiskColor(dataset.riskLevel)}>{dataset.riskLevel}</Badge>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>Samples: {dataset.samples}</p>
                  <p>Avg HPI: {dataset.avgHPI}</p>
                  <p>Date: {dataset.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedDatasets.length >= 2 && (
        <>
          {/* Comparison Controls */}
          <Card>
            <CardHeader>
              <CardTitle>Comparison Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Comparison Type</label>
                  <Select value={comparisonType} onValueChange={setComparisonType}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metals">Metal Concentrations</SelectItem>
                      <SelectItem value="indices">Pollution Indices</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Comparison */}
          <Card>
            <CardHeader>
              <CardTitle>Comparison Summary</CardTitle>
              <CardDescription>Key metrics across selected datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Dataset</th>
                      <th className="text-left p-2">Samples</th>
                      <th className="text-left p-2">Avg HPI</th>
                      <th className="text-left p-2">Risk Level</th>
                      <th className="text-left p-2">Lead (mg/L)</th>
                      <th className="text-left p-2">Cadmium (mg/L)</th>
                      <th className="text-left p-2">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSelectedData().map((dataset) => (
                      <tr key={dataset.id} className="border-b">
                        <td className="p-2 font-medium">{dataset.name}</td>
                        <td className="p-2">{dataset.samples}</td>
                        <td className="p-2">{dataset.avgHPI}</td>
                        <td className="p-2">
                          <Badge className={getRiskColor(dataset.riskLevel)}>{dataset.riskLevel}</Badge>
                        </td>
                        <td className="p-2">{dataset.metals.lead}</td>
                        <td className="p-2">{dataset.metals.cadmium}</td>
                        <td className="p-2">{dataset.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  {comparisonType === "metals" ? "Metal Concentrations" : "Pollution Indices"} Comparison
                </CardTitle>
                <CardDescription>Bar chart comparison across datasets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getComparisonData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey={comparisonType === "metals" ? "metal" : "name"} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {getSelectedData().map((dataset, index) => (
                        <Bar
                          key={dataset.id}
                          dataKey={comparisonType === "metals" ? dataset.name : "HPI"}
                          fill={`hsl(${index * 60 + 200}, 70%, 50%)`}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metal Profile Radar</CardTitle>
                <CardDescription>Comprehensive metal contamination profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="metal" />
                      <PolarRadiusAxis angle={90} domain={[0, "dataMax"]} />
                      {getSelectedData().map((dataset, index) => (
                        <Radar
                          key={dataset.id}
                          name={dataset.name}
                          dataKey={dataset.name}
                          stroke={`hsl(${index * 60 + 200}, 70%, 50%)`}
                          fill={`hsl(${index * 60 + 200}, 70%, 50%)`}
                          fillOpacity={0.1}
                        />
                      ))}
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Statistical Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Statistical Analysis</CardTitle>
              <CardDescription>Comparative statistics and significance testing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Highest Contamination</h4>
                  <p className="text-2xl font-bold text-destructive">Industrial Zone A</p>
                  <p className="text-sm text-muted-foreground">HPI: 78.5 (High Risk)</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Lowest Contamination</h4>
                  <p className="text-2xl font-bold text-green-600">Residential Zone C</p>
                  <p className="text-sm text-muted-foreground">HPI: 25.7 (Low Risk)</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Largest Difference</h4>
                  <p className="text-2xl font-bold">205%</p>
                  <p className="text-sm text-muted-foreground">Between highest and lowest</p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Key Findings</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Industrial Zone A shows significantly higher lead and chromium levels</li>
                  <li>• Agricultural Area B has moderate contamination, likely from fertilizer runoff</li>
                  <li>• Residential Zone C maintains safe levels across all measured metals</li>
                  <li>• Lead concentrations vary by 650% between highest and lowest sites</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {selectedDatasets.length < 2 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <GitCompare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Select Datasets to Compare</h3>
            <p className="text-muted-foreground text-center">
              Choose at least 2 datasets from the selection above to start comparing contamination levels.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
