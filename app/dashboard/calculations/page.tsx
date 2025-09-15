"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, AlertTriangle, CheckCircle, Info, Download } from "lucide-react"
import Link from "next/link"

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

interface CalculationResults {
  sampleId: string
  hpi: number
  mi: number
  hei: number
  cf: { [key: string]: number }
  pli: number
  classification: string
  riskLevel: "Low" | "Moderate" | "High" | "Critical"
}

// WHO/EPA standard values for heavy metals in drinking water (mg/L)
const standards = {
  lead: 0.01,
  cadmium: 0.003,
  chromium: 0.05,
  copper: 2.0,
  zinc: 3.0,
  iron: 0.3,
  manganese: 0.4,
  nickel: 0.07,
}

// Weights for HPI calculation
const weights = {
  lead: 0.25,
  cadmium: 0.25,
  chromium: 0.15,
  copper: 0.1,
  zinc: 0.05,
  iron: 0.1,
  manganese: 0.05,
  nickel: 0.05,
}

export default function CalculationsPage() {
  const [samples, setSamples] = useState<SampleData[]>([])
  const [results, setResults] = useState<CalculationResults[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    // Always clear sample data on first load to ensure sample count is 0
    localStorage.removeItem("sampleData");
    const storedSamples = localStorage.getItem("sampleData");
    if (storedSamples) {
      setSamples(JSON.parse(storedSamples));
    } else {
      setSamples([]);
    }
  }, [])

  const calculateHPI = (metals: any): number => {
    let weightedSum = 0
    let totalWeight = 0

    Object.entries(metals).forEach(([metal, concentration]) => {
      const standard = standards[metal as keyof typeof standards]
      const weight = weights[metal as keyof typeof weights]
      const qi = ((concentration as number) / standard) * 100
      weightedSum += weight * qi
      totalWeight += weight
    })

    return weightedSum / totalWeight
  }

  const calculateMI = (metals: any): number => {
    const concentrations = Object.values(metals) as number[]
    const standardValues = Object.values(standards)

    let sum = 0
    concentrations.forEach((conc, index) => {
      sum += conc / standardValues[index]
    })

    return sum / concentrations.length
  }

  const calculateHEI = (metals: any): number => {
    let sum = 0
    Object.entries(metals).forEach(([metal, concentration]) => {
      const standard = standards[metal as keyof typeof standards]
      sum += (concentration as number) / standard
    })
    return sum
  }
  
  const calculateCF = (metals: any): { [key: string]: number } => {
    const cf: { [key: string]: number } = {}
    Object.entries(metals).forEach(([metal, concentration]) => {
      const standard = standards[metal as keyof typeof standards]
      cf[metal] = (concentration as number) / standard
    })
    return cf
  }

  const calculatePLI = (cf: { [key: string]: number }): number => {
    const values = Object.values(cf)
    const product = values.reduce((acc, val) => acc * val, 1)
    return Math.pow(product, 1 / values.length)
  }

  const getClassification = (hpi: number): string => {
    if (hpi < 25) return "Excellent"
    if (hpi < 50) return "Good"
    if (hpi < 75) return "Poor"
    if (hpi < 100) return "Very Poor"
    return "Unsuitable for Drinking"
  }

  const getRiskLevel = (hpi: number): "Low" | "Moderate" | "High" | "Critical" => {
    if (hpi < 25) return "Low"
    if (hpi < 50) return "Moderate"
    if (hpi < 100) return "High"
    return "Critical"
  }

  const performCalculations = async () => {
    setIsCalculating(true)

    // Simulate calculation time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const calculationResults: CalculationResults[] = samples.map((sample) => {
      const hpi = calculateHPI(sample.metals)
      const mi = calculateMI(sample.metals)
      const hei = calculateHEI(sample.metals)
      const cf = calculateCF(sample.metals)
      const pli = calculatePLI(cf)

      return {
        sampleId: sample.sampleId,
        hpi: Math.round(hpi * 100) / 100,
        mi: Math.round(mi * 100) / 100,
        hei: Math.round(hei * 100) / 100,
        cf,
        pli: Math.round(pli * 100) / 100,
        classification: getClassification(hpi),
        riskLevel: getRiskLevel(hpi),
      }
    })

    setResults(calculationResults)
    setIsCalculating(false)
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

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return <CheckCircle className="h-4 w-4" />
      case "Moderate":
        return <Info className="h-4 w-4" />
      case "High":
      case "Critical":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  if (samples.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Calculations</h1>
          <p className="text-muted-foreground">Calculate pollution indices for your groundwater samples</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Sample Data Found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Please add sample data first to perform calculations.
            </p>
            <Link href="/dashboard/data-entry">
              <Button>Go to Data Entry</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calculations</h1>
          <p className="text-muted-foreground">Heavy metal pollution indices for {samples.length} samples</p>
        </div>
        <div className="flex gap-2">
          {results.length > 0 && (
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          )}
          <Button onClick={performCalculations} disabled={isCalculating}>
            <Calculator className="mr-2 h-4 w-4" />
            {isCalculating ? "Calculating..." : "Calculate Indices"}
          </Button>
        </div>
      </div>

      {isCalculating && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center space-y-4">
              <Calculator className="h-8 w-8 text-primary mx-auto animate-pulse" />
              <h3 className="text-lg font-semibold">Calculating Pollution Indices</h3>
              <p className="text-muted-foreground">Computing HPI, MI, HEI, CF, and PLI values...</p>
              <Progress value={66} className="w-full max-w-md mx-auto" />
            </div>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Results</TabsTrigger>
            <TabsTrigger value="classification">Classification</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average HPI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {results.length > 0
                      ? (() => {
                          const valid = results.map(r => r.hpi).filter(hpi => typeof hpi === "number" && !isNaN(hpi));
                          return valid.length > 0
                            ? Math.round((valid.reduce((sum, hpi) => sum + hpi, 0) / valid.length) * 100) / 100
                            : "--";
                        })()
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground">Heavy Metal Pollution Index</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Critical Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-destructive">
                    {results.length > 0
                      ? (() => {
                          const valid = results.filter(r => r.riskLevel === "Critical");
                          return typeof valid.length === "number" && !isNaN(valid.length) ? valid.length : "--";
                        })()
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground">Require immediate attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">High Risk Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {results.length > 0
                      ? (() => {
                          const valid = results.filter(r => r.riskLevel === "High");
                          return typeof valid.length === "number" && !isNaN(valid.length) ? valid.length : "--";
                        })()
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground">Need monitoring</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Safe Sites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {results.length > 0
                      ? (() => {
                          const valid = results.filter(r => r.riskLevel === "Low");
                          return typeof valid.length === "number" && !isNaN(valid.length) ? valid.length : "--";
                        })()
                      : "--"}
                  </div>
                  <p className="text-xs text-muted-foreground">Within acceptable limits</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Sample Results Summary</CardTitle>
                <CardDescription>Quick overview of all calculated indices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.map((result) => (
                    <div key={result.sampleId} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${getRiskColor(result.riskLevel)}`}>
                          {getRiskIcon(result.riskLevel)}
                        </div>
                        <div>
                          <p className="font-medium">{result.sampleId}</p>
                          <p className="text-sm text-muted-foreground">
                            HPI: {result.hpi} • Classification: {result.classification}
                          </p>
                        </div>
                      </div>
                      <Badge className={getRiskColor(result.riskLevel)}>{result.riskLevel} Risk</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid gap-6">
              {results.map((result) => (
                <Card key={result.sampleId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{result.sampleId}</CardTitle>
                      <Badge className={getRiskColor(result.riskLevel)}>{result.riskLevel} Risk</Badge>
                    </div>
                    <CardDescription>Detailed pollution index calculations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{result.hpi}</div>
                        <div className="text-sm text-muted-foreground">HPI</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{result.mi}</div>
                        <div className="text-sm text-muted-foreground">MI</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{result.hei}</div>
                        <div className="text-sm text-muted-foreground">HEI</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{result.pli}</div>
                        <div className="text-sm text-muted-foreground">PLI</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-sm font-medium">{result.classification}</div>
                        <div className="text-sm text-muted-foreground">Quality</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="classification" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>HPI Classification Scale</CardTitle>
                  <CardDescription>Heavy Metal Pollution Index interpretation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="font-medium">0 - 25</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="font-medium">25 - 50</span>
                    <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="font-medium">50 - 75</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Poor</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <span className="font-medium">75 - 100</span>
                    <Badge className="bg-orange-100 text-orange-800">Very Poor</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="font-medium">&gt; 100</span>
                    <Badge className="bg-red-100 text-red-800">Unsuitable</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Risk Assessment</CardTitle>
                  <CardDescription>Health risk levels based on contamination</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="font-medium">Low Risk</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Safe for consumption</p>
                  </div>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <span className="font-medium">Moderate Risk</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Regular monitoring recommended</p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-orange-600" />
                      <span className="font-medium">High Risk</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Treatment required before use</p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <span className="font-medium">Critical Risk</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Immediate action required</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
