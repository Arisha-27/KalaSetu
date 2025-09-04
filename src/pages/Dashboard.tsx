import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Package, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  Eye,
  Plus,
  Activity
} from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "24",
      change: "+12%",
      icon: Package,
      color: "text-primary"
    },
    {
      title: "Active Orders",
      value: "8",
      change: "+3",
      icon: ShoppingCart,
      color: "text-success"
    },
    {
      title: "Monthly Revenue",
      value: "₹15,240",
      change: "+18%",
      icon: DollarSign,
      color: "text-accent-dark"
    },
    {
      title: "Profile Views",
      value: "1,247",
      change: "+25%",
      icon: Eye,
      color: "text-muted-foreground"
    }
  ]

  const recentOrders = [
    { id: "#ORD-001", customer: "Priya Sharma", product: "Handwoven Scarf", amount: "₹850", status: "Processing" },
    { id: "#ORD-002", customer: "Arjun Patel", product: "Ceramic Vase", amount: "₹1,200", status: "Shipped" },
    { id: "#ORD-003", customer: "Meera Singh", product: "Wood Carving", amount: "₹2,100", status: "Delivered" },
  ]

  const quickActions = [
    { title: "Create New Listing", icon: Plus, description: "Use AI to generate listings" },
    { title: "Check Inventory", icon: Package, description: "Manage your stock levels" },
    { title: "View Analytics", icon: TrendingUp, description: "Track your performance" },
    { title: "Process Orders", icon: ShoppingCart, description: "Handle customer orders" },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-primary text-primary-foreground rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">Welcome back, Artisan!</h1>
        <p className="text-primary-foreground/80">
          Ready to showcase your craftsmanship to the world? Here's your dashboard overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <p className="text-xs text-success">
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Activity className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="ghost"
                className="w-full justify-start h-auto p-4 text-left hover:bg-muted"
              >
                <action.icon className="w-5 h-5 mr-3 text-primary" />
                <div>
                  <div className="font-medium text-foreground">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <ShoppingCart className="w-5 h-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <div>
                    <div className="font-medium text-foreground">{order.customer}</div>
                    <div className="text-sm text-muted-foreground">{order.product}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-foreground">{order.amount}</div>
                    <Badge variant={
                      order.status === "Delivered" ? "default" :
                      order.status === "Shipped" ? "secondary" : "outline"
                    } className="text-xs">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}