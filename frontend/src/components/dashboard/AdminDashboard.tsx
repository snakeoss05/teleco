import { 
  Radio, 
  Box, 
  Server, 
  Cable, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Clock,
  MapPin
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { EquipmentIcon, type EquipmentType } from "@/components/ui/equipment-icon";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data
const statsCards = [
  { title: "Total Equipment", value: "1,234", change: "+12%", icon: Radio, trend: "up" },
  { title: "Active", value: "1,089", change: "+8%", icon: CheckCircle2, trend: "up", color: "text-success" },
  { title: "Warnings", value: "98", change: "-5%", icon: AlertTriangle, trend: "down", color: "text-warning" },
  { title: "Inactive", value: "47", change: "+2%", icon: XCircle, trend: "up", color: "text-destructive" },
];

const equipmentByType = [
  { name: "FDT", count: 342 },
  { name: "FDH", count: 289 },
  { name: "MSAN", count: 156 },
  { name: "Splitter", count: 234 },
  { name: "Cabinet", count: 89 },
  { name: "Join", count: 124 },
];

const statusDistribution = [
  { name: "Active", value: 1089, color: "hsl(142, 71%, 45%)" },
  { name: "Warning", value: 98, color: "hsl(38, 92%, 50%)" },
  { name: "Inactive", value: 47, color: "hsl(var(--muted))" },
];

const recentActivity = [
  { id: 1, action: "Added", equipment: "FDT-127", type: "fdt" as EquipmentType, user: "John D.", time: "5 min ago" },
  { id: 2, action: "Updated", equipment: "FDH-089", type: "fdh" as EquipmentType, user: "Sarah M.", time: "12 min ago" },
  { id: 3, action: "Status changed", equipment: "MSAN-045", type: "ip-msan" as EquipmentType, user: "Mike R.", time: "1 hour ago" },
  { id: 4, action: "Added", equipment: "SPL-234", type: "splitter" as EquipmentType, user: "John D.", time: "2 hours ago" },
  { id: 5, action: "Deleted", equipment: "CAB-012", type: "cabinet" as EquipmentType, user: "Admin", time: "3 hours ago" },
];

export function AdminDashboard() {
  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of all network equipment</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={14} />
          Last updated: 2 minutes ago
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="card-interactive">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className={`text-2xl md:text-3xl font-bold ${stat.color || ''}`}>{stat.value}</p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color ? 'bg-current/10' : 'bg-accent/10'}`}>
                    <Icon className={`h-5 w-5 ${stat.color || 'text-accent'}`} />
                  </div>
                </div>
                <p className={`text-xs mt-2 ${stat.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Equipment by Type Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Equipment by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={equipmentByType}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar 
                    dataKey="count" 
                    fill="hsl(var(--accent))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center">
              <div className="w-1/2">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/2 space-y-3">
                {statusDistribution.map((status) => (
                  <div key={status.name} className="flex items-center gap-3">
                    <div 
                      className="h-3 w-3 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{status.name}</p>
                      <p className="text-xs text-muted-foreground">{status.value} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div 
                key={activity.id} 
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <EquipmentIcon type={activity.type} size="default" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    <span className="text-muted-foreground">{activity.action}:</span>{" "}
                    {activity.equipment}
                  </p>
                  <p className="text-xs text-muted-foreground">by {activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Zones Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin size={18} />
            Equipment by Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["North District", "Central Zone", "South Area", "East Wing"].map((zone) => (
              <div key={zone} className="p-4 rounded-lg border bg-card">
                <p className="font-medium mb-1">{zone}</p>
                <p className="text-2xl font-bold text-accent">{Math.floor(Math.random() * 300) + 100}</p>
                <p className="text-xs text-muted-foreground">equipment units</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
