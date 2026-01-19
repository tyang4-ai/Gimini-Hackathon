"use client"

import { useState } from "react"
import Link from "next/link"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"
import { ArrowLeft, AlertTriangle, ShieldAlert, Eye, Calendar, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Sample analytics data
const weeklyIncidents = [
  { day: "Mon", warnings: 12, dangers: 2, resolved: 14 },
  { day: "Tue", warnings: 8, dangers: 1, resolved: 9 },
  { day: "Wed", warnings: 15, dangers: 3, resolved: 17 },
  { day: "Thu", warnings: 6, dangers: 0, resolved: 6 },
  { day: "Fri", warnings: 10, dangers: 2, resolved: 11 },
  { day: "Sat", warnings: 4, dangers: 1, resolved: 5 },
  { day: "Sun", warnings: 2, dangers: 0, resolved: 2 },
]

const monthlyTrend = [
  { month: "Jan", incidents: 45, safeHours: 120 },
  { month: "Feb", incidents: 38, safeHours: 140 },
  { month: "Mar", incidents: 52, safeHours: 110 },
  { month: "Apr", incidents: 31, safeHours: 160 },
  { month: "May", incidents: 28, safeHours: 175 },
  { month: "Jun", incidents: 22, safeHours: 190 },
]

const hazardCategories = [
  { name: "Eye Protection", value: 35, color: "#8B5CF6" },
  { name: "Hand Safety", value: 28, color: "#22C55E" },
  { name: "Machine Guards", value: 18, color: "#EAB308" },
  { name: "Posture", value: 12, color: "#3B82F6" },
  { name: "Other", value: 7, color: "#6B7280" },
]

const recentIncidents = [
  { id: 1, type: "warning", message: "Safety glasses not detected", time: "2 hours ago", resolved: true },
  { id: 2, type: "danger", message: "Hand near active blade", time: "4 hours ago", resolved: true },
  { id: 3, type: "warning", message: "Improper lifting posture", time: "6 hours ago", resolved: true },
  { id: 4, type: "warning", message: "Machine guard not in place", time: "Yesterday", resolved: true },
  { id: 5, type: "danger", message: "Loose clothing near machinery", time: "Yesterday", resolved: true },
]

const hourlyActivity = [
  { hour: "6am", incidents: 1 },
  { hour: "8am", incidents: 3 },
  { hour: "10am", incidents: 5 },
  { hour: "12pm", incidents: 2 },
  { hour: "2pm", incidents: 6 },
  { hour: "4pm", incidents: 4 },
  { hour: "6pm", incidents: 3 },
  { hour: "8pm", incidents: 1 },
]

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("week")

  const totalIncidents = weeklyIncidents.reduce((acc, day) => acc + day.warnings + day.dangers, 0)
  const totalDangers = weeklyIncidents.reduce((acc, day) => acc + day.dangers, 0)
  const resolutionRate = Math.round(
    (weeklyIncidents.reduce((acc, day) => acc + day.resolved, 0) / totalIncidents) * 100,
  )

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null
    return (
      <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-xl">
        <p className="font-medium text-sm mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    )
  }

  const PieTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null
    const data = payload[0]
    return (
      <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-xl">
        <p className="text-sm font-medium">{data.name}</p>
        <p className="text-xs text-muted-foreground">{data.value}%</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Monitor
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎩</span>
              <h1 className="text-lg font-semibold">Sir Reginald's Safety Ledger</h1>
            </div>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="p-4 lg:p-6 max-w-7xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Incidents</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                {totalIncidents}
                <span className="text-sm font-normal text-safe flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  -12%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">vs. last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Danger Alerts</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2 text-danger">
                {totalDangers}
                <span className="text-sm font-normal text-safe flex items-center gap-1">
                  <TrendingDown className="h-4 w-4" />
                  -25%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Critical incidents</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Resolution Rate</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2 text-safe">
                {resolutionRate}%
                <span className="text-sm font-normal flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +5%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Issues addressed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Safe Working Hours</CardDescription>
              <CardTitle className="text-3xl flex items-center gap-2">
                47.2h
                <span className="text-sm font-normal text-safe flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  +8h
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Weekly Incidents Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Incidents</CardTitle>
                  <CardDescription>Warnings and dangers by day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      warnings: { label: "Warnings", color: "#EAB308" },
                      dangers: { label: "Dangers", color: "#EF4444" },
                    }}
                    className="h-[300px]"
                  >
                    <BarChart data={weeklyIncidents} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="warnings" name="Warnings" fill="#EAB308" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="dangers" name="Dangers" fill="#EF4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Hourly Activity Area Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity by Hour</CardTitle>
                  <CardDescription>When incidents occur most</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      incidents: { label: "Incidents", color: "#8B5CF6" },
                    }}
                    className="h-[300px]"
                  >
                    <AreaChart data={hourlyActivity} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="hour" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="incidents"
                        name="Incidents"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            {/* Monthly Trend Line Chart */}
            <Card>
              <CardHeader>
                <CardTitle>6-Month Safety Trend</CardTitle>
                <CardDescription>Incidents vs safe working hours over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    incidents: { label: "Incidents", color: "#EF4444" },
                    safeHours: { label: "Safe Hours", color: "#22C55E" },
                  }}
                  className="h-[350px]"
                >
                  <LineChart data={monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="month" stroke="#6B7280" />
                    <YAxis yAxisId="left" stroke="#6B7280" />
                    <YAxis yAxisId="right" orientation="right" stroke="#6B7280" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="incidents"
                      name="Incidents"
                      stroke="#EF4444"
                      strokeWidth={2}
                      dot={{ fill: "#EF4444" }}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="safeHours"
                      name="Safe Hours"
                      stroke="#22C55E"
                      strokeWidth={2}
                      dot={{ fill: "#22C55E" }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Hazard Categories Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Hazard Categories</CardTitle>
                  <CardDescription>Distribution of safety concerns</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      value: { label: "Count" },
                    }}
                    className="h-[300px]"
                  >
                    <PieChart>
                      <Tooltip content={<PieTooltip />} />
                      <Pie
                        data={hazardCategories}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {hazardCategories.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ChartContainer>
                  {/* Legend */}
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {hazardCategories.map((category) => (
                      <div key={category.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: category.color }} />
                        <span className="text-sm text-muted-foreground">
                          {category.name} ({category.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Details</CardTitle>
                  <CardDescription>Breakdown by hazard type</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hazardCategories.map((category) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-sm text-muted-foreground">{category.value}%</span>
                      </div>
                      <div className="h-2 bg-surface-light rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${category.value}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Recent Incidents Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Recent Incidents Log
            </CardTitle>
            <CardDescription>The latest safety observations from Sir Reginald</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div key={incident.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-light">
                  <div className="flex items-center gap-3">
                    {incident.type === "danger" ? (
                      <ShieldAlert className="h-5 w-5 text-danger" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-warning" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{incident.message}</p>
                      <p className="text-xs text-muted-foreground">{incident.time}</p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      incident.resolved ? "bg-safe/20 text-safe" : "bg-warning/20 text-warning"
                    }`}
                  >
                    {incident.resolved ? "Resolved" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
