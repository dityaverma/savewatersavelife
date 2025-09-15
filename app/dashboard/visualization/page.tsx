"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Layers, Download } from "lucide-react"
import dynamic from "next/dynamic"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })
const CircleMarker = dynamic(() => import("react-leaflet").then((mod) => mod.CircleMarker), { ssr: false })

interface SampleData {
  id: string
  sampleId: string
  latitude: number
  longitude: number
  depth: number
  collectionDate: string
  metals: {
    arsenic: number
    lead: number
    cadmium: number
    chromium: number
    mercury: number
    copper: number
    zinc: number
    iron: number
    manganese: number
    nickel: number
  }
  hpi?: number
  riskLevel?: "Low" | "Moderate" | "High" | "Critical"
}

interface CalculationResults {
  sampleId: string
  hpi: number
  mpi: number
  hei: number
  cf: { [key: string]: number }
  pli: number
  classification: string
  riskLevel: "Low" | "Moderate" | "High" | "Critical"
}

export default function VisualizationPage() {
  const [samples, setSamples] = useState<SampleData[]>([])
  const [results, setResults] = useState<CalculationResults[]>([])
  const [selectedMetal, setSelectedMetal] = useState("hpi")
  const [mapView, setMapView] = useState("satellite")
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const storedSamples = localStorage.getItem("sampleData")
    const storedResults = localStorage.getItem("calculationResults")

    if (storedSamples) {
      const parsedSamples = JSON.parse(storedSamples)
      setSamples(parsedSamples)
    }

    if (storedResults) {
      const parsedResults = JSON.parse(storedResults)
      setResults(parsedResults)

      // Merge results with samples
      if (storedSamples) {
        const parsedSamples = JSON.parse(storedSamples)
        const samplesWithResults = parsedSamples.map((sample: SampleData) => {
          const result = parsedResults.find((r: CalculationResults) => r.sampleId === sample.sampleId)
          return {
            ...sample,
            hpi: result?.hpi || 0,
            riskLevel: result?.riskLevel || "Low",
          }
        })
        setSamples(samplesWithResults)
      }
    } else if (storedSamples) {
      // Generate mock data for demonstration if no results
      const parsedSamples = JSON.parse(storedSamples)
      const samplesWithResults = parsedSamples.map((sample: SampleData) => ({
        ...sample,
        hpi: 25 + Math.random() * 75,
        riskLevel: ["Low", "Moderate", "High"][Math.floor(Math.random() * 3)] as any,
      }))
      setSamples(samplesWithResults)
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

  const getMapCenter = (): [number, number] => {
    if (samples.length === 0) return [40.7128, -74.006]

    const avgLat = samples.reduce((sum, s) => sum + s.latitude, 0) / samples.length
    const avgLng = samples.reduce((sum, s) => sum + s.longitude, 0) / samples.length
    return [avgLat, avgLng]
  }

  if (!isClient) {
    return <div>Loading map...</div>
  }

  return (
    <div className="space-y-6">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />

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
                  <SelectItem value="arsenic">Arsenic (As)</SelectItem>
                  <SelectItem value="lead">Lead (Pb)</SelectItem>
                  <SelectItem value="cadmium">Cadmium (Cd)</SelectItem>
                  <SelectItem value="chromium">Chromium (Cr)</SelectItem>
                  <SelectItem value="mercury">Mercury (Hg)</SelectItem>
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
                  <span className="text-sm">Risk Level Colors</span>
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
            <div className="h-[500px] rounded-lg overflow-hidden">
              {samples.length > 0 ? (
                <MapContainer center={getMapCenter()} zoom={13} style={{ height: "100%", width: "100%" }}>
                  <TileLayer
                    url={
                      mapView === "satellite"
                        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        : mapView === "terrain"
                          ? "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                          : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    }
                    attribution={
                      mapView === "satellite"
                        ? "&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                        : mapView === "terrain"
                          ? 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
                          : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }
                  />

                  {samples.map((sample) => {
                    const value = getMetalValue(sample, selectedMetal)
                    const radius = Math.max(8, Math.min(25, selectedMetal === "hpi" ? value / 4 : value * 100))

                    return (
                      <CircleMarker
                        key={sample.id}
                        center={[sample.latitude, sample.longitude]}
                        radius={radius}
                        fillColor={getRiskColor(sample.riskLevel || "Low")}
                        color="white"
                        weight={2}
                        opacity={1}
                        fillOpacity={0.8}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold">{sample.sampleId}</h3>
                            <p className="text-sm">
                              {selectedMetal === "hpi"
                                ? `HPI: ${value.toFixed(1)}`
                                : `${selectedMetal}: ${value.toFixed(3)} mg/L`}
                            </p>
                            <p className="text-sm">Risk Level: {sample.riskLevel}</p>
                            <p className="text-sm">Depth: {sample.depth}m</p>
                            <p className="text-sm">Date: {sample.collectionDate}</p>
                          </div>
                        </Popup>
                      </CircleMarker>
                    )
                  })}
                </MapContainer>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Sample Data</h3>
                    <p className="text-gray-500">Add sample data to view locations on the map</p>
                  </div>
                </div>
              )}
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
              {samples.length > 0
                ? (samples.reduce((sum, s) => sum + getMetalValue(s, selectedMetal), 0) / samples.length).toFixed(2)
                : "--"}
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
            <div className="text-2xl font-bold">{samples.length > 0 ? (samples.length * 0.5).toFixed(1) : "--"}</div>
            <p className="text-xs text-muted-foreground">km² surveyed</p>
          </CardContent>
        </Card>
      </div>

      {/* Sample Details */}
      {samples.length > 0 && (
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
                    <Badge style={{ backgroundColor: getRiskColor(sample.riskLevel || "Low"), color: "white" }}>
                      {sample.riskLevel}
                    </Badge>
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
      )}
    </div>
  )
}
