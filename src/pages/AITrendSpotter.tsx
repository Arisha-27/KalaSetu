import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Sparkles,
  Calendar,
  Target,
  Lightbulb,
  Star,
  ArrowUp,
  ArrowDown,
  Clock
} from "lucide-react"

export default function AITrendSpotter() {
  const currentTrends = [
    {
      id: 1,
      trend: "Festive Diwali Decor",
      description: "Demand for handcrafted diyas, torans, and ethnic home decor is rising for the upcoming Diwali season.",
      opportunity: "High",
      timeframe: "Next 6 weeks",
      demand: "Rising",
      suggestedActions: [
        "Create listings focused on 'festive home decor'",
        "Use keywords: Diwali, diyas, traditional, handmade",
        "Target price range: ₹200-₹800"
      ],
      icon: "🪔",
      urgency: "high"
    },
    {
      id: 2,
      trend: "Winter Wedding Season",
      description: "Wedding season approaching in North India. High demand for traditional jewelry and ceremonial items.",
      opportunity: "Very High",
      timeframe: "Next 12 weeks",
      demand: "Surging",
      suggestedActions: [
        "Focus on bridal jewelry and accessories",
        "Create wedding gift collections",
        "Collaborate with wedding planners"
      ],
      icon: "💒",
      urgency: "very-high"
    },
    {
      id: 3,
      trend: "Sustainable Packaging",
      description: "Growing consumer preference for eco-friendly and sustainable packaging solutions.",
      opportunity: "Medium",
      timeframe: "Long-term",
      demand: "Steady Growth",
      suggestedActions: [
        "Switch to biodegradable packaging",
        "Highlight sustainability in listings",
        "Create eco-friendly product lines"
      ],
      icon: "🌱",
      urgency: "medium"
    },
    {
      id: 4,
      trend: "Personalized Gifts",
      description: "Increasing demand for customized and personalized handmade items for special occasions.",
      opportunity: "High",
      timeframe: "Ongoing",
      demand: "Rising",
      suggestedActions: [
        "Offer customization services",
        "Create personalized product variants",
        "Market for birthdays and anniversaries"
      ],
      icon: "🎁",
      urgency: "high"
    }
  ]

  const marketInsights = [
    {
      category: "Home Decor",
      growth: "+24%",
      prediction: "Strong demand during festive season",
      confidence: 92
    },
    {
      category: "Jewelry",
      growth: "+18%",
      prediction: "Wedding season boost expected",
      confidence: 88
    },
    {
      category: "Textiles",
      growth: "+12%",
      prediction: "Winter collection trending",
      confidence: 75
    },
    {
      category: "Pottery",
      growth: "+8%",
      prediction: "Steady growth in traditional items",
      confidence: 81
    }
  ]

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "very-high":
        return <Badge className="bg-destructive text-destructive-foreground">Very High</Badge>
      case "high":
        return <Badge className="bg-warning text-warning-foreground">High</Badge>
      case "medium":
        return <Badge variant="secondary">Medium</Badge>
      default:
        return <Badge variant="outline">Low</Badge>
    }
  }

  const getDemandIcon = (demand: string) => {
    if (demand.includes("Rising") || demand.includes("Surging")) {
      return <ArrowUp className="w-4 h-4 text-success" />
    }
    return <ArrowDown className="w-4 h-4 text-muted-foreground" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Trend Spotter</h1>
          <p className="text-muted-foreground">Discover market trends and opportunities for your craft business</p>
        </div>
      </div>

      {/* Current Date Context */}
      <Card className="border-border bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <div className="font-medium text-foreground">Current Analysis Period</div>
              <div className="text-sm text-muted-foreground">September 2024 - Festive season approaching, wedding season preparation</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trending Opportunities */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Trending Opportunities
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {currentTrends.map((trend) => (
            <Card key={trend.id} className="border-border">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{trend.icon}</div>
                    <div>
                      <CardTitle className="text-lg text-foreground">{trend.trend}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        {getUrgencyBadge(trend.urgency)}
                        <div className="flex items-center gap-1">
                          {getDemandIcon(trend.demand)}
                          <span className="text-sm text-muted-foreground">{trend.demand}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{trend.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-foreground">Opportunity Level</div>
                    <div className="text-lg font-bold text-success">{trend.opportunity}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">Time Frame</div>
                    <div className="text-sm text-muted-foreground">{trend.timeframe}</div>
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-foreground mb-2 flex items-center gap-1">
                    <Lightbulb className="w-4 h-4" />
                    Suggested Actions
                  </div>
                  <ul className="space-y-1">
                    {trend.suggestedActions.map((action, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                  <Target className="w-4 h-4 mr-2" />
                  Create Listing for This Trend
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Market Insights */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5" />
            Market Category Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {marketInsights.map((insight) => (
              <div key={insight.category} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-foreground">{insight.category}</h4>
                  <Badge variant="outline" className="text-success border-success">
                    {insight.growth}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.prediction}</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">AI Confidence:</span>
                  <div className="flex-1 h-2 bg-muted rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${insight.confidence}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-foreground">{insight.confidence}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Analysis Summary */}
      <Card className="border-border bg-accent/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Sparkles className="w-5 h-5" />
            AI Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-accent-dark mt-0.5" />
              <div>
                <div className="font-medium text-foreground">Best Time to Act</div>
                <div className="text-sm text-muted-foreground">
                  Next 2-3 weeks for Diwali preparation, 6-8 weeks for wedding season items
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Star className="w-5 h-5 text-accent-dark mt-0.5" />
              <div>
                <div className="font-medium text-foreground">Priority Focus</div>
                <div className="text-sm text-muted-foreground">
                  Home decor and traditional items show highest opportunity scores this quarter
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-accent-dark mt-0.5" />
              <div>
                <div className="font-medium text-foreground">Success Factors</div>
                <div className="text-sm text-muted-foreground">
                  Keywords optimization, seasonal timing, and authentic craftsmanship storytelling
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}