"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  FileText,
  Download,
  Printer,
  Share2,
  Calendar,
  BarChart3,
  MapPin,
  Beaker,
  FileSpreadsheet,
  FilePen as FilePdf,
} from "lucide-react"

interface ReportConfig {
  title: string
  description: string
  author: string
  organization: string
  dateRange: {
    start: string
    end: string
  }
  includeMap: boolean
  includeCharts: boolean
  includeRawData: boolean
  includeCalculations: boolean
  includeRecommendations: boolean
  format: "pdf" | "excel" | "word"
  template: "standard" | "detailed" | "summary"
}

export default function ReportsPage() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    title: "Groundwater Heavy Metal Pollution Assessment Report",
    description: "",
    author: "Dr. John Doe",
    organization: "Environmental Research Institute",
    dateRange: {
      start: "2024-01-01",
      end: "2024-01-31",
    },
    includeMap: true,
    includeCharts: true,
    includeRawData: true,
    includeCalculations: true,
    includeRecommendations: true,
    format: "pdf",
    template: "standard",
  })

  const [isGenerating, setIsGenerating] = useState(false)

  const generateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise((resolve) => setTimeout(resolve, 3000))
    setIsGenerating(false)

    // In a real app, this would trigger the actual report generation
    alert(`Report "${reportConfig.title}" generated successfully!`)
  }

  const previewReport = () => {
    // Open report preview in new window/modal
    alert("Report preview would open here")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate comprehensive analysis reports and export data</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={previewReport}>
            <FileText className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={generateReport} disabled={isGenerating}>
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Information</CardTitle>
              <CardDescription>Basic details and metadata for your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  value={reportConfig.title}
                  onChange={(e) => setReportConfig({ ...reportConfig, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the study area, objectives, and methodology..."
                  value={reportConfig.description}
                  onChange={(e) => setReportConfig({ ...reportConfig, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="author">Author</Label>
                  <Input
                    id="author"
                    value={reportConfig.author}
                    onChange={(e) => setReportConfig({ ...reportConfig, author: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={reportConfig.organization}
                    onChange={(e) => setReportConfig({ ...reportConfig, organization: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={reportConfig.dateRange.start}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        dateRange: { ...reportConfig.dateRange, start: e.target.value },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={reportConfig.dateRange.end}
                    onChange={(e) =>
                      setReportConfig({
                        ...reportConfig,
                        dateRange: { ...reportConfig.dateRange, end: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Options</CardTitle>
              <CardDescription>Select what to include in your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeMap"
                    checked={reportConfig.includeMap}
                    onCheckedChange={(checked) => setReportConfig({ ...reportConfig, includeMap: checked as boolean })}
                  />
                  <Label htmlFor="includeMap" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    GIS Maps & Visualization
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCharts"
                    checked={reportConfig.includeCharts}
                    onCheckedChange={(checked) =>
                      setReportConfig({ ...reportConfig, includeCharts: checked as boolean })
                    }
                  />
                  <Label htmlFor="includeCharts" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Charts & Graphs
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeRawData"
                    checked={reportConfig.includeRawData}
                    onCheckedChange={(checked) =>
                      setReportConfig({ ...reportConfig, includeRawData: checked as boolean })
                    }
                  />
                  <Label htmlFor="includeRawData" className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4" />
                    Raw Sample Data
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeCalculations"
                    checked={reportConfig.includeCalculations}
                    onCheckedChange={(checked) =>
                      setReportConfig({ ...reportConfig, includeCalculations: checked as boolean })
                    }
                  />
                  <Label htmlFor="includeCalculations" className="flex items-center gap-2">
                    <Beaker className="h-4 w-4" />
                    Index Calculations
                  </Label>
                </div>

                <div className="flex items-center space-x-2 col-span-2">
                  <Checkbox
                    id="includeRecommendations"
                    checked={reportConfig.includeRecommendations}
                    onCheckedChange={(checked) =>
                      setReportConfig({ ...reportConfig, includeRecommendations: checked as boolean })
                    }
                  />
                  <Label htmlFor="includeRecommendations">Recommendations & Risk Assessment</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Format & Template</CardTitle>
              <CardDescription>Choose output format and report template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select
                    value={reportConfig.format}
                    onValueChange={(value: "pdf" | "excel" | "word") =>
                      setReportConfig({ ...reportConfig, format: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">
                        <div className="flex items-center gap-2">
                          <FilePdf className="h-4 w-4" />
                          PDF Document
                        </div>
                      </SelectItem>
                      <SelectItem value="excel">
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="h-4 w-4" />
                          Excel Workbook
                        </div>
                      </SelectItem>
                      <SelectItem value="word">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Word Document
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Report Template</Label>
                  <Select
                    value={reportConfig.template}
                    onValueChange={(value: "standard" | "detailed" | "summary") =>
                      setReportConfig({ ...reportConfig, template: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard Report</SelectItem>
                      <SelectItem value="detailed">Detailed Analysis</SelectItem>
                      <SelectItem value="summary">Executive Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Preview & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Preview</CardTitle>
              <CardDescription>Preview of your report structure</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Report Sections</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Executive Summary
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Methodology
                  </div>
                  {reportConfig.includeRawData && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Sample Data
                    </div>
                  )}
                  {reportConfig.includeCalculations && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Index Calculations
                    </div>
                  )}
                  {reportConfig.includeCharts && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Statistical Analysis
                    </div>
                  )}
                  {reportConfig.includeMap && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      GIS Visualization
                    </div>
                  )}
                  {reportConfig.includeRecommendations && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      Recommendations
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    Conclusions
                  </div>
                </div>
              </div>

              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Estimated Pages</h4>
                <div className="text-2xl font-bold">
                  {reportConfig.template === "summary"
                    ? "8-12"
                    : reportConfig.template === "detailed"
                      ? "25-35"
                      : "15-20"}
                </div>
                <p className="text-xs text-muted-foreground">Based on selected options</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Printer className="mr-2 h-4 w-4" />
                Print Report
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Share2 className="mr-2 h-4 w-4" />
                Share Report
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Calendar className="mr-2 h-4 w-4" />
                Schedule Generation
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">Industrial Zone Report</p>
                    <p className="text-xs text-muted-foreground">Generated 2 days ago</p>
                  </div>
                  <Badge variant="outline">PDF</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">Monthly Summary</p>
                    <p className="text-xs text-muted-foreground">Generated 1 week ago</p>
                  </div>
                  <Badge variant="outline">Excel</Badge>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">Quarterly Analysis</p>
                    <p className="text-xs text-muted-foreground">Generated 2 weeks ago</p>
                  </div>
                  <Badge variant="outline">PDF</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
