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
  Activity,
  Sparkles,
  Zap,
  Target,
  Rocket
} from "lucide-react"

export default function Dashboard() {
  const stats = [
    {
      title: "Total Products",
      value: "24",
      change: "+12%",
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary/20"
    },
    {
      title: "Active Orders",
      value: "8",
      change: "+3",
      icon: ShoppingCart,
      color: "text-purple",
      bg: "bg-purple/10",
      border: "border-purple/20"
    },
    {
      title: "Monthly Revenue",
      value: "₹15,240",
      change: "+18%",
      icon: DollarSign,
      color: "text-coral",
      bg: "bg-coral/10",
      border: "border-coral/20"
    },
    {
      title: "Profile Views",
      value: "1,247",
      change: "+25%",
      icon: Eye,
      color: "text-medium-blue",
      bg: "bg-medium-blue/10",
      border: "border-medium-blue/20"
    }
  ]

  const recentOrders = [
    { 
      id: "#ORD-001", 
      customer: "Priya Sharma", 
      product: "Handwoven Scarf", 
      amount: "₹850", 
      status: "Processing",
      statusColor: "bg-purple text-purple-foreground"
    },
    { 
      id: "#ORD-002", 
      customer: "Arjun Patel", 
      product: "Ceramic Vase", 
      amount: "₹1,200", 
      status: "Shipped",
      statusColor: "bg-medium-blue text-medium-blue-foreground"
    },
    { 
      id: "#ORD-003", 
      customer: "Meera Singh", 
      product: "Wood Carving", 
      amount: "₹2,100", 
      status: "Delivered",
      statusColor: "bg-success text-success-foreground"
    },
  ]

  const quickActions = [
    { 
      title: "Create New Listing", 
      icon: Plus, 
      description: "Use AI to generate listings",
      color: "text-primary",
      bg: "bg-primary/5 hover:bg-primary/10",
      border: "border-primary/20"
    },
    { 
      title: "Check Inventory", 
      icon: Package, 
      description: "Manage your stock levels",
      color: "text-purple",
      bg: "bg-purple/5 hover:bg-purple/10",
      border: "border-purple/20"
    },
    { 
      title: "View Analytics", 
      icon: TrendingUp, 
      description: "Track your performance",
      color: "text-coral",
      bg: "bg-coral/5 hover:bg-coral/10",
      border: "border-coral/20"
    },
    { 
      title: "Process Orders", 
      icon: ShoppingCart, 
      description: "Handle customer orders",
      color: "text-medium-blue",
      bg: "bg-medium-blue/5 hover:bg-medium-blue/10",
      border: "border-medium-blue/20"
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section with Gradient */}
      <div className="bg-gradient-to-r from-primary via-purple to-medium-blue text-primary-foreground rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center animate-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Master Artisan!</h1>
              <p className="text-primary-foreground/80 text-lg">
                Ready to showcase your craftsmanship to the world? Here's your dashboard overview.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards with Different Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className={`${stat.border} ${stat.bg} border-2 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-success" />
                <p className="text-sm text-success font-medium">
                  {stat.change} from last month
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions with Colorful Design */}
        <Card className="border-border hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-purple/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Rocket className="w-4 h-4 text-primary-foreground" />
              </div>
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-6">
            {quickActions.map((action, index) => (
              <Button
                key={action.title}
                variant="ghost"
                className={`w-full justify-start h-auto p-4 text-left ${action.bg} ${action.border} border hover:scale-102 transition-all duration-200`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${action.bg}`}>
                  <action.icon className={`w-5 h-5 ${action.color}`} />
                </div>
                <div>
                  <div className="font-medium text-foreground">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Recent Orders with Enhanced Design */}
        <Card className="border-border hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-coral/5 to-medium-blue/5 rounded-t-lg">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <div className="w-8 h-8 bg-coral rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 text-coral-foreground" />
              </div>
              Recent Orders
              <Badge className="ml-auto bg-coral text-coral-foreground">Live</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-all duration-200 hover:scale-102"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-purple/20 rounded-full flex items-center justify-center font-bold text-primary">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.product}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-foreground">{order.amount}</div>
                    <Badge className={`${order.statusColor} text-xs`}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievement Section */}
      <Card className="border-2 border-accent bg-gradient-to-r from-accent/5 to-light-blue/5 hover:shadow-xl transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-light-blue rounded-xl flex items-center justify-center animate-glow">
                <Target className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1">Congratulations! 🎉</h3>
                <p className="text-muted-foreground">You've reached 1000+ profile views this month!</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-accent to-light-blue hover:from-accent/90 hover:to-light-blue/90 text-white">
              <Zap className="w-4 h-4 mr-2" />
              View Insights
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}