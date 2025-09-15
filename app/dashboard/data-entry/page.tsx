"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Calculator, FileSpreadsheet } from "lucide-react"
import { useRouter } from "next/navigation"

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
}

export default function DataEntryPage() {
  const [samples, setSamples] = useState<SampleData[]>([])
  const [currentSample, setCurrentSample] = useState<Partial<SampleData>>({
    sampleId: "",
    latitude: 0,
    longitude: 0,
    depth: 0,
    collectionDate: "",
    metals: {
      lead: 0,
      cadmium: 0,
      chromium: 0,
      copper: 0,
      zinc: 0,
      iron: 0,
      manganese: 0,
      nickel: 0,
    },
  })
  const [csvData, setCsvData] = useState("")
  const router = useRouter()

  const addSample = () => {
    if (currentSample.sampleId && currentSample.metals) {
      const newSample: SampleData = {
        ...currentSample,
        id: Date.now().toString(),
      } as SampleData
      setSamples([...samples, newSample])
      setCurrentSample({
        sampleId: "",
        latitude: 0,
        longitude: 0,
        depth: 0,
        collectionDate: "",
        metals: {
          lead: 0,
          cadmium: 0,
          chromium: 0,
          copper: 0,
          zinc: 0,
          iron: 0,
          manganese: 0,
          nickel: 0,
        },
      })
    }
  }

  const removeSample = (id: string) => {
    setSamples(samples.filter((sample) => sample.id !== id))
  }

  const processCsvData = () => {
    try {
      const lines = csvData.trim().split("\n")
      const headers = lines[0].split(",").map((h) => h.trim())
      const newSamples: SampleData[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())
        const sample: SampleData = {
          id: Date.now().toString() + i,
          sampleId: values[0] || `Sample-${i}`,
          latitude: Number.parseFloat(values[1]) || 0,
          longitude: Number.parseFloat(values[2]) || 0,
          depth: Number.parseFloat(values[3]) || 0,
          collectionDate: values[4] || new Date().toISOString().split("T")[0],
          metals: {
            lead: Number.parseFloat(values[5]) || 0,
            cadmium: Number.parseFloat(values[6]) || 0,
            chromium: Number.parseFloat(values[7]) || 0,
            copper: Number.parseFloat(values[8]) || 0,
            zinc: Number.parseFloat(values[9]) || 0,
            iron: Number.parseFloat(values[10]) || 0,
            manganese: Number.parseFloat(values[11]) || 0,
            nickel: Number.parseFloat(values[12]) || 0,
          },
        }
        newSamples.push(sample)
      }

      setSamples([...samples, ...newSamples])
      setCsvData("")
    } catch (error) {
      alert("Error processing CSV data. Please check the format.")
    }
  }

  const calculateIndices = () => {
    if (samples.length === 0) {
      alert("Please add sample data first.")
      return
    }
    // Store samples in localStorage for calculations page
    localStorage.setItem("sampleData", JSON.stringify(samples))
    router.push("/dashboard/calculations")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Data Entry</h1>
          <p className="text-muted-foreground">Enter groundwater sample data for heavy metal pollution analysis</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={calculateIndices} disabled={samples.length === 0}>
            <Calculator className="mr-2 h-4 w-4" />
            Calculate Indices
          </Button>
        </div>
      </div>

      <Tabs defaultValue="manual" className="space-y-6">
        <TabsList>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          <TabsTrigger value="csv">CSV Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sample Information</CardTitle>
              <CardDescription>Enter basic sample details and location data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sampleId">Sample ID</Label>
                  <Input
                    id="sampleId"
                    placeholder="GW-2024-001"
                    value={currentSample.sampleId}
                    onChange={(e) => setCurrentSample({ ...currentSample, sampleId: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    type="number"
                    step="0.000001"
                    placeholder="40.7128"
                    value={currentSample.latitude}
                    onChange={(e) =>
                      setCurrentSample({ ...currentSample, latitude: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    type="number"
                    step="0.000001"
                    placeholder="-74.0060"
                    value={currentSample.longitude}
                    onChange={(e) =>
                      setCurrentSample({ ...currentSample, longitude: Number.parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth">Depth (m)</Label>
                  <Input
                    id="depth"
                    type="number"
                    step="0.1"
                    placeholder="15.5"
                    value={currentSample.depth}
                    onChange={(e) => setCurrentSample({ ...currentSample, depth: Number.parseFloat(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collectionDate">Collection Date</Label>
                  <Input
                    id="collectionDate"
                    type="date"
                    value={currentSample.collectionDate}
                    onChange={(e) => setCurrentSample({ ...currentSample, collectionDate: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Heavy Metal Concentrations</CardTitle>
              <CardDescription>Enter metal concentrations in mg/L</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(currentSample.metals || {}).map(([metal, value]) => (
                  <div key={metal} className="space-y-2">
                    <Label htmlFor={metal} className="capitalize">
                      {metal} (mg/L)
                    </Label>
                    <Input
                      id={metal}
                      type="number"
                      step="0.001"
                      placeholder="0.000"
                      value={value}
                      onChange={(e) =>
                        setCurrentSample({
                          ...currentSample,
                          metals: {
                            ...currentSample.metals!,
                            [metal]: Number.parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <Button onClick={addSample} className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Sample
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="csv" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>CSV Data Upload</CardTitle>
              <CardDescription>
                Paste CSV data with columns: Sample ID, Latitude, Longitude, Depth, Date, Lead, Cadmium, Chromium,
                Copper, Zinc, Iron, Manganese, Nickel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="csvData">CSV Data</Label>
                <Textarea
                  id="csvData"
                  placeholder="Sample ID,Latitude,Longitude,Depth,Date,Lead,Cadmium,Chromium,Copper,Zinc,Iron,Manganese,Nickel
GW-001,40.7128,-74.0060,15.5,2024-01-15,0.05,0.02,0.1,0.3,1.2,2.5,0.8,0.04"
                  className="min-h-[200px] font-mono text-sm"
                  value={csvData}
                  onChange={(e) => setCsvData(e.target.value)}
                />
              </div>
              <Button onClick={processCsvData} disabled={!csvData.trim()}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Process CSV Data
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sample List */}
      {samples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Added Samples ({samples.length})</CardTitle>
            <CardDescription>Review and manage your sample data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {samples.map((sample) => (
                <div key={sample.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{sample.sampleId}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {sample.latitude}, {sample.longitude}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Depth: {sample.depth}m • Date: {sample.collectionDate}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Pb: {sample.metals.lead} | Cd: {sample.metals.cadmium} | Cr: {sample.metals.chromium} | Cu:{" "}
                      {sample.metals.copper}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSample(sample.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
