"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Layers, Download, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

interface SampleData {
  id: string
  sampleId: string
  latitude: number
  longitude: number
  depth: number
  collectionDate: string
  metals: {
    lead: number
    cadmium: number
    chromium: number
    copper: number
    zinc: number
    iron: number
    manganese: number
    nickel: number
  }
  hpi?: number
  riskLevel?: "Low" | "Moderate" | "High" | "Critical"
}

export default function VisualizationPage() {
  const [samples, setSamples] = useState<SampleData[]>([])
  const [selectedMetal, setSelectedMetal] = useState("hpi")
  const [mapView, setMapView] = useState("satellite")
  const [showHeatmap, setShowHeatmap] = useState(true)

  useEffect(() => {
    // Load sample data and results
    const storedSamples = localStorage.getItem("sampleData")
    if (storedSamples) {
      const parsedSamples = JSON.parse(storedSamples)
      // Add mock HPI and risk level data for visualization
      const samplesWithResults = parsedSamples.map((sample: SampleData, index: number) => ({
        ...sample,
        hpi: 25 + Math.random() * 100, // Mock HPI values
        riskLevel: ["Low", "Moderate", "High", "Critical"][Math.floor(Math.random() * 4)] as any,
      }))
      setSamples(samplesWithResults)
    } else {
      // Generate mock data for demonstration
      const mockSamples: SampleData[] = Array.from({ length: 15 }, (_, i) => ({
        id: `mock-${i}`,
        sampleId: `GW-2024-${String(i + 1).padStart(3, "0")}`,
        latitude: 40.7128 + (Math.random() - 0.5) * 0.1,
        longitude: -74.006 + (Math.random() - 0.5) * 0.1,
        depth: 10 + Math.random() * 20,
        collectionDate: "2024-01-15",
        metals: {
          lead: Math.random() * 0.1,
          cadmium: Math.random() * 0.01,
          chromium: Math.random() * 0.1,
          copper: Math.random() * 2,
          zinc: Math.random() * 3,
          iron: Math.random() * 1,
          manganese: Math.random() * 0.5,
          nickel: Math.random() * 0.1,
        },
        hpi: 25 + Math.random() * 100,
        riskLevel: ["Low", "Moderate", "High", "Critical"][Math.floor(Math.random() * 4)] as any,
      }))
      setSamples(mockSamples)
    }
  }, [])

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "#10b981"
      case "Moderate":
        return "#f59e0b"
      case "High":
        return "#f97316"
      case "Critical":
        return "#ef4444"
      default:
        return "#6b7280"
    }
  }

  const getMetalValue = (sample: SampleData, metal: string) => {
    if (metal === "hpi") return sample.hpi || 0
    return sample.metals[metal as keyof typeof sample.metals] || 0
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">GIS Visualization</h1>
          <p className="text-muted-foreground">Interactive mapping and spatial analysis of groundwater contamination</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Map
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Map Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Map Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Display Parameter</label>
              <Select value={selectedMetal} onValueChange={setSelectedMetal}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hpi">HPI Index</SelectItem>
                  <SelectItem value="lead">Lead (Pb)</SelectItem>
                  <SelectItem value="cadmium">Cadmium (Cd)</SelectItem>
                  <SelectItem value="chromium">Chromium (Cr)</SelectItem>
                  <SelectItem value="copper">Copper (Cu)</SelectItem>
                  <SelectItem value="zinc">Zinc (Zn)</SelectItem>
                  <SelectItem value="iron">Iron (Fe)</SelectItem>
                  <SelectItem value="manganese">Manganese (Mn)</SelectItem>
                  <SelectItem value="nickel">Nickel (Ni)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Map View</label>
              <Select value={mapView} onValueChange={setMapView}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="satellite">Satellite</SelectItem>
                  <SelectItem value="terrain">Terrain</SelectItem>
                  <SelectItem value="roadmap">Roadmap</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium">Layer Options</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={showHeatmap}
                    onChange={(e) => setShowHeatmap(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Heatmap Overlay</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                  <span className="text-sm">Sample Points</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm">Contamination Zones</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Map Tools</label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Map Display */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Interactive Map - {selectedMetal.toUpperCase()} Distribution
            </CardTitle>
            <CardDescription>
              Showing {samples.length} sampling locations with {selectedMetal} contamination levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mock Map Display */}
            <div className="relative bg-gradient-to-br from-blue-100 to-green-100 rounded-lg h-[500px] overflow-hidden">
              {/* Map Background Pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" className="text-gray-400">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Sample Points */}
              {samples.map((sample, index) => {
                const x = 50 + (sample.longitude + 74.006) * 2000
                const y = 250 - (sample.latitude - 40.7128) * 2000
                const value = getMetalValue(sample, selectedMetal)
                const size = Math.max(8, Math.min(20, value / 5))

                return (
                  <div
                    key={sample.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={{
                      left: `${Math.max(5, Math.min(95, x))}%`,
                      top: `${Math.max(5, Math.min(95, y))}%`,
                    }}
                  >
                    <div
                      className="rounded-full border-2 border-white shadow-lg transition-all duration-200 group-hover:scale-125"
                      style={{
                        backgroundColor: getRiskColor(sample.riskLevel || "Low"),
                        width: `${size}px`,
                        height: `${size}px`,
                      }}
                    />
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {sample.sampleId}
                      <br />
                      {selectedMetal === "hpi" ? `HPI: ${value.toFixed(1)}` : `${value.toFixed(3)} mg/L`}
                      <br />
                      Risk: {sample.riskLevel}
                    </div>
                  </div>
                )
              })}

              {/* Heatmap Overlay (if enabled) */}
              {showHeatmap && (
                <div className="absolute inset-0 pointer-events-none">
                  {samples.map((sample, index) => {
                    const x = 50 + (sample.longitude + 74.006) * 2000
                    const y = 250 - (sample.latitude - 40.7128) * 2000
                    const intensity = getMetalValue(sample, selectedMetal) / 100

                    return (
                      <div
                        key={`heatmap-${sample.id}`}
                        className="absolute rounded-full"
                        style={{
                          left: `${Math.max(0, Math.min(100, x))}%`,
                          top: `${Math.max(0, Math.min(100, y))}%`,
                          width: "100px",
                          height: "100px",
                          background: `radial-gradient(circle, ${getRiskColor(sample.riskLevel || "Low")}${Math.round(
                            intensity * 30,
                          )
                            .toString(16)
                            .padStart(2, "0")} 0%, transparent 70%)`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                    )
                  })}
                </div>
              )}

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                <h4 className="text-sm font-semibold mb-2">Risk Levels</h4>
                <div className="space-y-1">
                  {["Low", "Moderate", "High", "Critical"].map((level) => (
                    <div key={level} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getRiskColor(level) }} />
                      <span>{level}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scale Bar */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 shadow-lg">
                <div className="text-xs text-gray-600 mb-1">Scale</div>
                <div className="flex items-center gap-1">
                  <div className="w-12 h-1 bg-black"></div>
                  <span className="text-xs">1 km</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics Panel */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{samples.length}</div>
            <p className="text-xs text-muted-foreground">Mapped locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">High Risk Areas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {samples.filter((s) => s.riskLevel === "High" || s.riskLevel === "Critical").length}
            </div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average {selectedMetal.toUpperCase()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(samples.reduce((sum, s) => sum + getMetalValue(s, selectedMetal), 0) / samples.length).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedMetal === "hpi" ? "Index value" : "mg/L concentration"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Coverage Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5</div>
            <p className="text-xs text-muted-foreground">km² surveyed</p>
          </CardContent>
        </Card>
      </div>

      {/* Sample Details */}
      <Card>
        <CardHeader>
          <CardTitle>Sample Locations</CardTitle>
          <CardDescription>Detailed information for all mapped samples</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {samples.slice(0, 10).map((sample) => (
              <div key={sample.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getRiskColor(sample.riskLevel || "Low") }}
                  />
                  <div>
                    <p className="font-medium">{sample.sampleId}</p>
                    <p className="text-sm text-muted-foreground">
                      {sample.latitude.toFixed(4)}, {sample.longitude.toFixed(4)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${getRiskColor(sample.riskLevel || "Low")} text-white`}>{sample.riskLevel}</Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedMetal === "hpi"
                      ? `HPI: ${sample.hpi?.toFixed(1)}`
                      : `${getMetalValue(sample, selectedMetal).toFixed(3)} mg/L`}
                  </p>
                </div>
              </div>
            ))}
            {samples.length > 10 && (
              <div className="text-center pt-2">
                <Button variant="outline">View All {samples.length} Samples</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
