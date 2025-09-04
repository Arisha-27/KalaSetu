import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingCart, 
  Package,
  Truck,
  CheckCircle,
  Clock,
  Printer,
  MessageSquare,
  Eye
} from "lucide-react"

export default function OrderDashboard() {
  const orders = [
    {
      id: "#ORD-001",
      customer: "Priya Sharma",
      product: "Handwoven Silk Scarf",
      amount: "₹850",
      status: "Processing",
      date: "2024-01-15",
      address: "Mumbai, Maharashtra"
    },
    {
      id: "#ORD-002",
      customer: "Arjun Patel",
      product: "Ceramic Tea Set",
      amount: "₹2,100",
      status: "Shipped",
      date: "2024-01-14",
      address: "Ahmedabad, Gujarat"
    },
    {
      id: "#ORD-003",
      customer: "Meera Singh",
      product: "Wood Carved Elephant",
      amount: "₹1,450",
      status: "Delivered",
      date: "2024-01-12",
      address: "Delhi, India"
    },
    {
      id: "#ORD-004",
      customer: "Rajesh Kumar",
      product: "Silver Jewelry Set",
      amount: "₹3,200",
      status: "New",
      date: "2024-01-16",
      address: "Bangalore, Karnataka"
    },
    {
      id: "#ORD-005",
      customer: "Sunita Devi",
      product: "Handmade Candles Set",
      amount: "₹640",
      status: "Processing",
      date: "2024-01-15",
      address: "Jaipur, Rajasthan"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "New":
        return <Badge className="bg-accent text-accent-foreground">New</Badge>
      case "Processing":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Processing</Badge>
      case "Shipped":
        return <Badge variant="outline" className="border-primary text-primary">Shipped</Badge>
      case "Delivered":
        return <Badge className="bg-success text-success-foreground">Delivered</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "New":
        return <Clock className="w-4 h-4 text-accent-dark" />
      case "Processing":
        return <Package className="w-4 h-4 text-warning" />
      case "Shipped":
        return <Truck className="w-4 h-4 text-primary" />
      case "Delivered":
        return <CheckCircle className="w-4 h-4 text-success" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filterOrders = (status: string) => {
    if (status === "all") return orders
    return orders.filter(order => order.status.toLowerCase() === status.toLowerCase())
  }

  const orderStats = {
    total: orders.length,
    new: orders.filter(o => o.status === "New").length,
    processing: orders.filter(o => o.status === "Processing").length,
    shipped: orders.filter(o => o.status === "Shipped").length,
    delivered: orders.filter(o => o.status === "Delivered").length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <ShoppingCart className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Order Dashboard</h1>
          <p className="text-muted-foreground">Manage and track all your customer orders</p>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{orderStats.total}</div>
            <div className="text-sm text-muted-foreground">Total Orders</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-accent-dark">{orderStats.new}</div>
            <div className="text-sm text-muted-foreground">New Orders</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{orderStats.processing}</div>
            <div className="text-sm text-muted-foreground">Processing</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{orderStats.shipped}</div>
            <div className="text-sm text-muted-foreground">Shipped</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{orderStats.delivered}</div>
            <div className="text-sm text-muted-foreground">Delivered</div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="new">New</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="delivered">Delivered</TabsTrigger>
            </TabsList>
            
            {["all", "new", "processing", "shipped", "delivered"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {filterOrders(tab).map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center">
                        {getStatusIcon(order.status)}
                        <div className="text-xs text-muted-foreground mt-1">
                          {order.date}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground">{order.id}</span>
                          {getStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-muted-foreground">{order.customer}</div>
                        <div className="text-sm text-foreground">{order.product}</div>
                        <div className="text-xs text-muted-foreground">{order.address}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-bold text-lg text-foreground">{order.amount}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Printer className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}