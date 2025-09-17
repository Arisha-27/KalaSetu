import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign,
  Eye,
  ShoppingCart,
  Users,
  Calendar,
  MapPin
} from "lucide-react"

export default function SalesAnalytics() {
  const salesData = [
    { month: "Jan", revenue: 8400, orders: 24 },
    { month: "Feb", revenue: 12200, orders: 31 },
    { month: "Mar", revenue: 15600, orders: 42 },
    { month: "Apr", revenue: 11800, orders: 35 },
    { month: "May", revenue: 18900, orders: 52 },
    { month: "Jun", revenue: 22100, orders: 61 }
  ]

  const topProducts = [
    { name: "Handwoven Silk Scarf", sales: 45, revenue: "₹38,250" },
    { name: "Ceramic Tea Set", sales: 28, revenue: "₹58,800" },
    { name: "Wood Carved Elephant", sales: 22, revenue: "₹31,900" },
    { name: "Silver Jewelry Set", sales: 18, revenue: "₹57,600" },
  ]

  const customerLocations = [
    { city: "Mumbai", orders: 142, percentage: 28 },
    { city: "Delhi", orders: 108, percentage: 22 },
    { city: "Bangalore", orders: 89, percentage: 18 },
    { city: "Chennai", orders: 67, percentage: 13 },
    { city: "Others", orders: 94, percentage: 19 }
  ]

  const trafficSources = [
    { source: "Organic Search", visitors: 1247, percentage: 42 },
    { source: "Social Media", visitors: 856, percentage: 29 },
    { source: "Direct", visitors: 523, percentage: 18 },
    { source: "Referral", visitors: 324, percentage: 11 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Sales & Traffic Analytics</h1>
          <p className="text-muted-foreground">Track your business performance and customer insights</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">₹89,400</div>
                <div className="text-sm text-muted-foreground">Total Revenue</div>
                <div className="text-xs text-success">+18% from last month</div>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">245</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
                <div className="text-xs text-success">+12% from last month</div>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">2,950</div>
                <div className="text-sm text-muted-foreground">Page Views</div>
                <div className="text-xs text-success">+25% from last month</div>
              </div>
              <Eye className="w-8 h-8 text-accent-dark" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">8.3%</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
                <div className="text-xs text-success">+2.1% from last month</div>
              </div>
              <TrendingUp className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="products">Top Products</TabsTrigger>
          <TabsTrigger value="customers">Customer Insights</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="w-5 h-5" />
                Revenue & Orders Trend (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {salesData.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{data.month} 2024</div>
                        <div className="text-sm text-muted-foreground">{data.orders} orders</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">₹{data.revenue.toLocaleString()}</div>
                      <div className="text-sm text-success">
                        {index > 0 ? (
                          `+${Math.round(((data.revenue - salesData[index-1].revenue) / salesData[index-1].revenue) * 100)}%`
                        ) : (
                          "Baseline"
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <ShoppingCart className="w-5 h-5" />
                Best Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent-foreground font-bold">
                        #{index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.sales} units sold</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">{product.revenue}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MapPin className="w-5 h-5" />
                Customer Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customerLocations.map((location) => (
                  <div key={location.city} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{location.city}</div>
                        <div className="text-sm text-muted-foreground">{location.orders} orders</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">{location.percentage}%</div>
                      <div className="w-20 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${location.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Users className="w-5 h-5" />
                Traffic Sources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trafficSources.map((source) => (
                  <div key={source.source} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-accent-dark" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{source.source}</div>
                        <div className="text-sm text-muted-foreground">{source.visitors} visitors</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">{source.percentage}%</div>
                      <div className="w-20 h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-accent rounded-full" 
                          style={{ width: `${source.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}