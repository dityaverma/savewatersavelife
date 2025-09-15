"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Bell, CheckCircle, Clock, Settings, Mail, Smartphone, X } from "lucide-react"

interface Alert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  description: string
  location: string
  value: number
  threshold: number
  timestamp: string
  acknowledged: boolean
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Lead Concentration Exceeded",
    description: "Lead levels at 0.156 mg/L exceed WHO guidelines (0.01 mg/L)",
    location: "Site GW-2024-045",
    value: 0.156,
    threshold: 0.01,
    timestamp: "2024-01-15T10:30:00Z",
    acknowledged: false,
  },
  {
    id: "2",
    type: "critical",
    title: "HPI Critical Level",
    description: "Heavy Metal Pollution Index reached 142.3, indicating severe contamination",
    location: "Site GW-2024-032",
    value: 142.3,
    threshold: 100,
    timestamp: "2024-01-15T09:15:00Z",
    acknowledged: false,
  },
  {
    id: "3",
    type: "warning",
    title: "Cadmium Approaching Limit",
    description: "Cadmium concentration at 0.0028 mg/L approaching WHO limit (0.003 mg/L)",
    location: "Site GW-2024-038",
    value: 0.0028,
    threshold: 0.003,
    timestamp: "2024-01-14T16:45:00Z",
    acknowledged: true,
  },
  {
    id: "4",
    type: "warning",
    title: "Multiple Metal Detection",
    description: "Elevated levels of lead, chromium, and nickel detected simultaneously",
    location: "Site GW-2024-041",
    value: 85.2,
    threshold: 75,
    timestamp: "2024-01-14T14:20:00Z",
    acknowledged: false,
  },
  {
    id: "5",
    type: "info",
    title: "Sampling Frequency Low",
    description: "No samples collected in this area for 30 days",
    location: "Zone B-North",
    value: 30,
    threshold: 21,
    timestamp: "2024-01-13T08:00:00Z",
    acknowledged: true,
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [alertSettings, setAlertSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    hpiThreshold: 100,
    leadThreshold: 0.01,
    cadmiumThreshold: 0.003,
    autoAcknowledge: false,
  })

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <Bell className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case "critical":
        return "border-red-200 bg-red-50"
      case "warning":
        return "border-yellow-200 bg-yellow-50"
      case "info":
        return "border-blue-200 bg-blue-50"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "warning":
        return "secondary"
      case "info":
        return "outline"
      default:
        return "outline"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const criticalAlerts = alerts.filter((a) => a.type === "critical" && !a.acknowledged)
  const warningAlerts = alerts.filter((a) => a.type === "warning" && !a.acknowledged)
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Alerts & Notifications</h1>
          <p className="text-muted-foreground">Monitor critical contamination levels and system notifications</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="destructive" className="px-3 py-1">
            {unacknowledgedCount} Unacknowledged
          </Badge>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Require immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warning Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{warningAlerts.length}</div>
            <p className="text-xs text-muted-foreground">Need monitoring</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12m</div>
            <p className="text-xs text-muted-foreground">Average acknowledgment</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active Alerts</TabsTrigger>
          <TabsTrigger value="history">Alert History</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {alerts.filter((a) => !a.acknowledged).length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                <p className="text-muted-foreground text-center">
                  All contamination levels are within acceptable limits.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {alerts
                .filter((a) => !a.acknowledged)
                .map((alert) => (
                  <Card key={alert.id} className={`${getAlertColor(alert.type)} border-l-4`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{alert.title}</h4>
                              <Badge variant={getBadgeVariant(alert.type)}>{alert.type.toUpperCase()}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>📍 {alert.location}</span>
                              <span>🕒 {formatTimestamp(alert.timestamp)}</span>
                              <span>
                                📊 {alert.value} / {alert.threshold}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledge
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => dismissAlert(alert.id)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>Previously acknowledged and resolved alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts
                  .filter((a) => a.acknowledged)
                  .map((alert) => (
                    <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg opacity-60">
                      <div className="flex items-center gap-3">
                        {getAlertIcon(alert.type)}
                        <div>
                          <p className="font-medium">{alert.title}</p>
                          <p className="text-sm text-muted-foreground">{alert.location}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">Acknowledged</Badge>
                        <p className="text-xs text-muted-foreground mt-1">{formatTimestamp(alert.timestamp)}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure how and when you receive alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <Label htmlFor="email">Email Notifications</Label>
                  </div>
                  <Switch
                    id="email"
                    checked={alertSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setAlertSettings((prev) => ({ ...prev, emailNotifications: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <Label htmlFor="sms">SMS Notifications</Label>
                  </div>
                  <Switch
                    id="sms"
                    checked={alertSettings.smsNotifications}
                    onCheckedChange={(checked) => setAlertSettings((prev) => ({ ...prev, smsNotifications: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="push">Push Notifications</Label>
                  </div>
                  <Switch
                    id="push"
                    checked={alertSettings.pushNotifications}
                    onCheckedChange={(checked) => setAlertSettings((prev) => ({ ...prev, pushNotifications: checked }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Thresholds</CardTitle>
              <CardDescription>Set custom thresholds for automatic alert generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hpi">HPI Threshold</Label>
                  <Input
                    id="hpi"
                    type="number"
                    value={alertSettings.hpiThreshold}
                    onChange={(e) => setAlertSettings((prev) => ({ ...prev, hpiThreshold: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lead">Lead Threshold (mg/L)</Label>
                  <Input
                    id="lead"
                    type="number"
                    step="0.001"
                    value={alertSettings.leadThreshold}
                    onChange={(e) => setAlertSettings((prev) => ({ ...prev, leadThreshold: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto">Auto-acknowledge info alerts</Label>
                <Switch
                  id="auto"
                  checked={alertSettings.autoAcknowledge}
                  onCheckedChange={(checked) => setAlertSettings((prev) => ({ ...prev, autoAcknowledge: checked }))}
                />
              </div>

              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
