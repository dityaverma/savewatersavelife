import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  MapPin,
  Beaker,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Upload,
  FileText,
  Activity,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your groundwater analysis projects.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/data-entry">
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              New Analysis
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Samples</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground"></p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">3 completed this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contaminated Sites</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">0</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Safe Sites</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">0</div>
            <p className="text-xs text-muted-foreground">Within acceptable limits</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Your latest groundwater analysis projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Industrial Zone Analysis</p>
                  <p className="text-sm text-muted-foreground">45 samples • 2 days ago</p>
                </div>
              </div>
              <Badge variant="destructive">High Risk</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Agricultural Area Study</p>
                  <p className="text-sm text-muted-foreground">32 samples • 5 days ago</p>
                </div>
              </div>
              <Badge variant="secondary">Moderate</Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Residential Area Check</p>
                  <p className="text-sm text-muted-foreground">28 samples • 1 week ago</p>
                </div>
              </div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Safe</Badge>
            </div>

            <Link href="/dashboard/projects">
              <Button variant="outline" className="w-full bg-transparent">
                View All Projects
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dashboard/data-entry">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Upload className="mr-2 h-4 w-4" />
                Upload New Sample Data
              </Button>
            </Link>

            <Link href="/dashboard/calculations">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Beaker className="mr-2 h-4 w-4" />
                Calculate Pollution Indices
              </Button>
            </Link>

            <Link href="/dashboard/visualization">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <MapPin className="mr-2 h-4 w-4" />
                View GIS Visualization
              </Button>
            </Link>

            <Link href="/dashboard/reports">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <FileText className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
            </Link>

            <Link href="/dashboard/trends">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trend Analysis
              </Button>
            </Link>

            <Link href="/dashboard/comparison">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <BarChart3 className="mr-2 h-4 w-4" />
                Compare Datasets
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Critical Alerts
          </CardTitle>
          <CardDescription>Sites requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div>
                <p className="font-medium text-destructive">Site ID: GW-2024-045</p>
                <p className="text-sm text-muted-foreground">HPI: 156.7 • Lead concentration exceeds safe limits</p>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
              <div>
                <p className="font-medium text-destructive">Site ID: GW-2024-032</p>
                <p className="text-sm text-muted-foreground">HPI: 142.3 • Multiple heavy metals detected</p>
              </div>
              <Badge variant="destructive">Critical</Badge>
            </div>

            <Link href="/dashboard/alerts">
              <Button variant="outline" className="w-full bg-transparent">
                View All Alerts
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
