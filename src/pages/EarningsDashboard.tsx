import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DollarSign, 
  TrendingUp,
  Calendar,
  Download,
  Clock,
  CreditCard,
  Banknote,
  Receipt
} from "lucide-react"

export default function EarningsDashboard() {
  const earningsData = {
    totalEarnings: 127450,
    thisMonth: 18900,
    pendingPayouts: 12300,
    lastPayout: 15600,
    transactionFees: 2340
  }

  const recentTransactions = [
    {
      id: 1,
      date: "Jan 15, 2024",
      description: "Payment for Ceramic Tea Set",
      customer: "Arjun Patel",
      amount: 2100,
      fee: 63,
      net: 2037,
      status: "Completed"
    },
    {
      id: 2,
      date: "Jan 14, 2024",
      description: "Payment for Handwoven Scarf",
      customer: "Priya Sharma",
      amount: 850,
      fee: 26,
      net: 824,
      status: "Completed"
    },
    {
      id: 3,
      date: "Jan 13, 2024",
      description: "Payment for Silver Jewelry Set",
      customer: "Meera Singh",
      amount: 3200,
      fee: 96,
      net: 3104,
      status: "Processing"
    },
    {
      id: 4,
      date: "Jan 12, 2024",
      description: "Payment for Wood Carving",
      customer: "Rajesh Kumar",
      amount: 1450,
      fee: 44,
      net: 1406,
      status: "Completed"
    }
  ]

  const payoutHistory = [
    {
      id: 1,
      date: "Jan 10, 2024",
      amount: 15600,
      method: "Bank Transfer",
      status: "Completed",
      reference: "PAY_001234567"
    },
    {
      id: 2,
      date: "Dec 25, 2023",
      amount: 22400,
      method: "Bank Transfer",
      status: "Completed",
      reference: "PAY_001234566"
    },
    {
      id: 3,
      date: "Dec 10, 2023",
      amount: 18900,
      method: "Bank Transfer",
      status: "Completed",
      reference: "PAY_001234565"
    }
  ]

  const monthlyData = [
    { month: "Aug 2023", earnings: 14200, orders: 38 },
    { month: "Sep 2023", earnings: 16800, orders: 42 },
    { month: "Oct 2023", earnings: 19500, orders: 48 },
    { month: "Nov 2023", earnings: 17300, orders: 45 },
    { month: "Dec 2023", earnings: 21600, orders: 52 },
    { month: "Jan 2024", earnings: 18900, orders: 49 }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>
      case "Processing":
        return <Badge className="bg-warning text-warning-foreground">Processing</Badge>
      case "Pending":
        return <Badge variant="outline">Pending</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Earnings Dashboard</h1>
            <p className="text-muted-foreground">Track your income and payout history</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Download className="w-4 h-4 mr-2" />
          Download Report
        </Button>
      </div>

      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  ₹{earningsData.totalEarnings.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Earnings</div>
                <div className="text-xs text-success">+18% from last month</div>
              </div>
              <TrendingUp className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  ₹{earningsData.thisMonth.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">This Month</div>
                <div className="text-xs text-success">+12% from last month</div>
              </div>
              <Calendar className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  ₹{earningsData.pendingPayouts.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Pending Payouts</div>
                <div className="text-xs text-warning">Available in 2 days</div>
              </div>
              <Clock className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-foreground">
                  ₹{earningsData.transactionFees.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Transaction Fees</div>
                <div className="text-xs text-muted-foreground">3% platform fee</div>
              </div>
              <Receipt className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="payouts">Payout History</TabsTrigger>
          <TabsTrigger value="analytics">Monthly Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="w-5 h-5" />
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{transaction.description}</div>
                        <div className="text-sm text-muted-foreground">Customer: {transaction.customer}</div>
                        <div className="text-xs text-muted-foreground">{transaction.date}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">₹{transaction.amount.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Fee: ₹{transaction.fee}</div>
                      <div className="text-sm text-success">Net: ₹{transaction.net}</div>
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Banknote className="w-5 h-5" />
                Payout History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payoutHistory.map((payout) => (
                  <div
                    key={payout.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Banknote className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Payout to Bank Account</div>
                        <div className="text-sm text-muted-foreground">Method: {payout.method}</div>
                        <div className="text-xs text-muted-foreground">Ref: {payout.reference}</div>
                        <div className="text-xs text-muted-foreground">{payout.date}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">₹{payout.amount.toLocaleString()}</div>
                      {getStatusBadge(payout.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="w-5 h-5" />
                Monthly Earnings Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monthlyData.map((data, index) => (
                  <div
                    key={data.month}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-accent-dark" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{data.month}</div>
                        <div className="text-sm text-muted-foreground">{data.orders} orders completed</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-lg text-foreground">₹{data.earnings.toLocaleString()}</div>
                      <div className="text-sm text-success">
                        {index > 0 ? (
                          `+${Math.round(((data.earnings - monthlyData[index-1].earnings) / monthlyData[index-1].earnings) * 100)}%`
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
      </Tabs>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Download className="w-6 h-6 text-primary" />
              <span>Download Tax Report</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <CreditCard className="w-6 h-6 text-primary" />
              <span>Update Payment Method</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
              <Receipt className="w-6 h-6 text-primary" />
              <span>View All Receipts</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}