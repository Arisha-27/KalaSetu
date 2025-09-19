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
  Target,
  ArrowUp,
  ArrowDown,
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

  const currentTrends = [
    { id: 1, trend: "Festive Diwali Decor", icon: "🪔", urgency: "high", demand: "Rising", description: "Demand for handcrafted diyas, torans, and ethnic home decor is rising for the upcoming Diwali season." },
    { id: 2, trend: "Winter Wedding Season", icon: "💒", urgency: "very-high", demand: "Surging", description: "Wedding season approaching in North India. High demand for traditional jewelry and ceremonial items." },
    { id: 3, trend: "Sustainable Packaging", icon: "🌱", urgency: "medium", demand: "Steady Growth", description: "Growing consumer preference for eco-friendly and sustainable packaging solutions." },
    { id: 4, trend: "Personalized Gifts", icon: "🎁", urgency: "high", demand: "Rising", description: "Increasing demand for customized and personalized handmade items for special occasions." }
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

  const getUrgencyBadge = (urgency: string) => { /* ... */ };
  const getDemandIcon = (demand: string) => { /* ... */ };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">AI Trend Spotter</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentTrends.map((trend) => (
          <Card key={trend.id} className="border-border flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">{trend.trend}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col justify-between">
              <p className="text-muted-foreground">{trend.description}</p>
              <Button
                className="w-full mt-4"
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
