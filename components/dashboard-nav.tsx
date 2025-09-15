"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Home,
  Upload,
  Beaker,
  MapPin,
  BarChart3,
  FileText,
  TrendingUp,
  Settings,
  AlertTriangle,
  FolderOpen,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Data Entry",
    href: "/dashboard/data-entry",
    icon: Upload,
  },
  {
    name: "Calculations",
    href: "/dashboard/calculations",
    icon: Beaker,
  },
  {
    name: "Visualization",
    href: "/dashboard/visualization",
    icon: MapPin,
  },
  {
    name: "Projects",
    href: "/dashboard/projects",
    icon: FolderOpen,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    name: "Trends",
    href: "/dashboard/trends",
    icon: TrendingUp,
  },
  {
    name: "Comparison",
    href: "/dashboard/comparison",
    icon: BarChart3,
  },
  {
    name: "Alerts",
    href: "/dashboard/alerts",
    icon: AlertTriangle,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="w-64 border-r bg-muted/10 min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2 transition-all duration-200",
                    isActive && "bg-primary/10 text-primary hover:bg-primary/15",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
