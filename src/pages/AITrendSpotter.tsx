import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Target,
  Lightbulb,
  Star,
  ArrowUp,
  ArrowDown,
  Clock,
  Loader2,
} from "lucide-react"

type Suggestion = {
  what_to_make: string[];
  why_trending: string;
  materials: string[];
  price_range: string;
  source: string;
};

export default function AITrendSpotter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<Suggestion | null>(null);
  const [selectedTrendTitle, setSelectedTrendTitle] = useState("");
  const [loadingTrendId, setLoadingTrendId] = useState<number | null>(null);

  // --- THIS ARRAY IS NEEDED TO DISPLAY THE CARDS ---
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
  ];

  const fetchTrendDetails = async (trend: { id: number, trend: string }) => {
    setLoadingTrendId(trend.id);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const trendName = encodeURIComponent(trend.trend);
      const response = await fetch(`${API_URL}/trend-suggestions/${trendName}`);
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data: Suggestion = await response.json();
      
      setSelectedTrend(data);
      setSelectedTrendTitle(trend.trend);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching suggestions. Please try again.");
    } finally {
      setLoadingTrendId(null);
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case "very-high": return <Badge className="bg-destructive text-destructive-foreground">Very High</Badge>;
      case "high": return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case "medium": return <Badge variant="secondary">Medium</Badge>;
      default: return <Badge variant="outline">Low</Badge>;
    }
  };

  const getDemandIcon = (demand: string) => {
    if (demand.includes("Rising") || demand.includes("Surging")) {
      return <ArrowUp className="w-4 h-4 text-success" />;
    }
    return <ArrowDown className="w-4 h-4 text-muted-foreground" />;
  };

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
      
      {/* --- THIS PART DISPLAYS THE CARDS USING THE ARRAY ABOVE --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentTrends.map((trend) => (
          <Card key={trend.id} className="border-border flex flex-col">
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
            <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
              <p className="text-muted-foreground">{trend.description}</p>
              <Button
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground mt-4"
                onClick={() => fetchTrendDetails(trend)}
                disabled={loadingTrendId === trend.id}
              >
                {loadingTrendId === trend.id ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Fetching...</>
                ) : (
                  <><Target className="w-4 h-4 mr-2" />Get AI Suggestions</>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>AI Suggestions for "{selectedTrendTitle}"</DialogTitle>
            <DialogDescription>
              Here are AI-powered insights to help you capitalize on this trend.
            </DialogDescription>
          </DialogHeader>
          {selectedTrend && (
            <div className="space-y-3 py-4">
              <p><strong>What to make:</strong> {selectedTrend.what_to_make.join(", ")}</p>
              <p><strong>Why it's trending:</strong> {selectedTrend.why_trending}</p>
              <p><strong>Materials to use:</strong> {selectedTrend.materials.join(", ")}</p>
              <p><strong>Price range:</strong> {selectedTrend.price_range}</p>
              <p><strong>Source materials from:</strong> {selectedTrend.source}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
