import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, BarChart3, MapPin, Shield, Zap, Droplets, Beaker, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Navigation */}
      <nav className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">HMPI Analyzer</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in-up">
          <Badge variant="secondary" className="mb-4">
            Professional Environmental Analysis
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Groundwater Heavy Metal
            <span className="text-primary block">Pollution Assessment</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Advanced scientific platform for analyzing groundwater contamination using HPI, MI, HEI, CF, and PLI indices
            with interactive GIS visualization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="group">
                Start Analysis
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Comprehensive Analysis Tools</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need for professional groundwater pollution assessment and environmental research.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Beaker className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle>Multi-Index Calculation</CardTitle>
              <CardDescription>
                Automated computation of HPI, MI, HEI, CF, and PLI indices with scientific accuracy
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <MapPin className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle>GIS Visualization</CardTitle>
              <CardDescription>
                Interactive maps with heatmap effects and contamination level indicators
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <BarChart3 className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Comprehensive charts, trend analysis, and pollution severity assessment</CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle>Quality Classification</CardTitle>
              <CardDescription>
                Water quality categorization with health risk assessment and color coding
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle>Trend Analysis</CardTitle>
              <CardDescription>Temporal variation tracking and comparative analysis between datasets</CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <Zap className="h-10 w-10 text-primary mb-2 group-hover:scale-110 transition-transform" />
              <CardTitle>Export & Reports</CardTitle>
              <CardDescription>
                Professional reports in CSV, Excel, and PDF formats for research publication
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Analysis?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join environmental researchers worldwide using our platform for groundwater pollution assessment.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="group">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Droplets className="h-6 w-6 text-primary" />
              <span className="font-semibold">HMPI Analyzer</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Groundwater HMPI Analyzer. Professional environmental analysis platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
