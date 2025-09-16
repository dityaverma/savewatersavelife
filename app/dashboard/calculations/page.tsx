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

const standards = {
  arsenic: 0.01,
  lead: 0.01,
  cadmium: 0.003,
  chromium: 0.05,
  mercury: 0.001,
  copper: 2.0,
  zinc: 3.0,
  iron: 0.3,
  manganese: 0.4,
  nickel: 0.07,
}

const idealValues = {
  arsenic: 0,
  lead: 0,
  cadmium: 0,
  chromium: 0,
  mercury: 0,
  copper: 0,
  zinc: 0,
  iron: 0,
  manganese: 0,
  nickel: 0,
}

const calculateWeights = () => {
  const weightSum = Object.values(standards)
    .filter(s => s !== 0)
    .reduce((acc, s) => acc + 1 / s, 0)

  const weights: { [key: string]: number } = {}
  Object.entries(standards).forEach(([metal, s]) => {
    if (s !== 0) {
      weights[metal] = (1 / s) / weightSum
    }
  })
  return weights
}

export default function CalculationsPage() {
  const [samples, setSamples] = useState<SampleData[]>([])
  const [results, setResults] = useState<CalculationResults[]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  useEffect(() => {
    const storedSamples = localStorage.getItem("sampleData")
    if (storedSamples) {
      setSamples(JSON.parse(storedSamples))
    } else {
      setSamples([])
    }
  }, [])

  const calculateCF = (metals: any): { [key: string]: number } => {
    const MAX_CF = 100
    const cf: { [key: string]: number } = {}
    Object.entries(metals).forEach(([metal, concentration]) => {
      const standard = standards[metal as keyof typeof standards]
      if (standard !== 0) {
        cf[metal] = parseFloat(Math.min((concentration as number) / standard, MAX_CF).toFixed(3))
      }
    })
    return cf
  }

  const calculateHPI = (metals: any): number => {
    const weights = calculateWeights()
    let hpiNumerator = 0
    let hpiDenominator = 0
    Object.entries(metals).forEach(([metal, concentration]) => {
      const standard = standards[metal as keyof typeof standards]
      const ideal = idealValues[metal as keyof typeof idealValues]
      if (typeof standard === "number" && standard !== 0 && typeof concentration === "number") {
        const qi = Math.abs(((concentration - ideal) / (standard - ideal)) * 100)
        const cappedQi = Math.min(qi, 500)
        hpiNumerator += weights[metal] * cappedQi
        hpiDenominator += weights[metal]
      }
    })
    return hpiDenominator === 0 ? 0 : parseFloat((hpiNumerator / hpiDenominator).toFixed(3))
  }

  const calculateMPI = (cf: { [key: string]: number }): number => {
    const values = Object.values(cf)
    const product = values.reduce((acc, val) => acc * val, 1)
    return parseFloat(Math.pow(product, 1 / values.length).toFixed(3))
  }

  const calculateHEI = (cf: { [key: string]: number }): number => {
    return parseFloat(Object.values(cf).reduce((sum, val) => sum + val, 0).toFixed(3))
  }

  const calculatePLI = (cf: { [key: string]: number }): number => {
    const values = Object.values(cf)
    const product = values.reduce((acc, val) => acc * val, 1)
    return parseFloat(Math.pow(product, 1 / values.length).toFixed(3))
  }

  const getClassification = (hpi: number): string => {
    if (hpi < 50) return "Excellent"
    if (hpi < 100) return "Slightly Polluted"
    return "Unsuitable for Drinking"
  }

  const getRiskLevel = (hpi: number): "Low" | "Moderate" | "High" | "Critical" => {
    if (hpi < 50) return "Low"
    if (hpi < 100) return "Moderate"
    if (hpi < 200) return "High"
    return "Critical"
  }

  const performCalculations = async () => {
    setIsCalculating(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const calculationResults: CalculationResults[] = samples.map((sample) => {
      const cf = calculateCF(sample.metals)
      const hpi = calculateHPI(sample.metals)
      const mpi = calculateMPI(cf)
      const hei = calculateHEI(cf)
      const pli = calculatePLI(cf)

      return {
        sampleId: sample.sampleId,
        hpi: parseFloat(hpi.toFixed(3)),
        mpi: parseFloat(mpi.toFixed(3)),
        hei: parseFloat(hei.toFixed(3)),
        cf,
        pli: parseFloat(pli.toFixed(3)),
        classification: getClassification(hpi),
        riskLevel: getRiskLevel(hpi),
      }
    })

    setResults(calculationResults)
    localStorage.setItem("calculationResults", JSON.stringify(calculationResults))
    setIsCalculating(false)
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Moderate":
        return "bg-yellow-100 text-yellow-800"
      case "High":
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

  // ✅ FIXED calculateAverage with proper TypeScript type guard
  const calculateAverage = (key: keyof CalculationResults): string => {
    if (results.length === 0) return "--"

    const values = results
      .map((r) => r[key])
      .filter((val): val is number => typeof val === "number" && !isNaN(val))

    if (values.length === 0) return "--"

    const sum = values.reduce((total, val) => total + val, 0)
    const avg = sum / values.length
    return avg.toFixed(3)
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
              <p className="text-muted-foreground">Computing HPI, MPI, HEI, CF, and PLI values...</p>
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
                  <div className="text-2xl font-bold">{calculateAverage("hpi")}</div>
                  <p className="text-xs text-muted-foreground">Heavy Metal Pollution Index</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average MPI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{calculateAverage("mpi")}</div>
                  <p className="text-xs text-muted-foreground">Metal Pollution Index</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average HEI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{calculateAverage("hei")}</div>
                  <p className="text-xs text-muted-foreground">Heavy Metal Evaluation Index</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Average PLI</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{calculateAverage("pli")}</div>
                  <p className="text-xs text-muted-foreground">Pollution Load Index</p>
                </CardContent>
              </Card>
            </div>
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
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{result.hpi}</div>
                        <div className="text-sm text-muted-foreground">HPI</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{result.mpi}</div>
                        <div className="text-sm text-muted-foreground">MPI</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{result.hei}</div>
                        <div className="text-sm text-muted-foreground">HEI</div>
                      </div>
                      <div className="text-center p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold">{result.pli}</div>
                        <div className="text-sm text-muted-foreground">PLI</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Contamination Factors (CF)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                        {Object.entries(result.cf).map(([metal, cf]) => (
                          <div
                            key={metal}
                            className={`p-2 rounded text-center ${cf > 1 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                          >
                            <div className="font-medium">{metal.toUpperCase()}</div>
                            <div>{cf.toFixed(3)}</div>
                          </div>
                        ))}
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
                    <span className="font-medium">&lt; 50</span>
                    <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="font-medium">50 - 100</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Slightly Polluted</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="font-medium">&gt; 100</span>
                    <Badge className="bg-red-100 text-red-800">Unsuitable</Badge>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Index Interpretations</CardTitle>
                  <CardDescription>Understanding pollution indices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="font-medium mb-1">PLI (Pollution Load Index)</div>
                    <p className="text-sm text-muted-foreground">
                      PLI &gt; 1: Overall pollution; PLI &lt; 1: No net pollution
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="font-medium mb-1">CF (Contamination Factor)</div>
                    <p className="text-sm text-muted-foreground">
                      CF &gt; 1: Exceeds standard; CF &lt; 1: Within limits
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <div className="font-medium mb-1">HEI (Heavy Metal Evaluation Index)</div>
                    <p className="text-sm text-muted-foreground">Sum of contamination factors for all metals</p>
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
