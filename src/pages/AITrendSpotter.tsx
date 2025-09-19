import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// Import Dialog components for the modal
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
  Loader2, // Import a loader icon
} from "lucide-react"

// Define a type for the suggestion data for better code safety
type Suggestion = {
  what_to_make: string[];
  why_trending: string;
  materials: string[];
  price_range: string;
  source: string;
};

export default function AITrendSpotter() {
  // State to manage the modal (dialog)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState<Suggestion | null>(null);
  const [selectedTrendTitle, setSelectedTrendTitle] = useState("");
  const [loadingTrendId, setLoadingTrendId] = useState<number | null>(null);

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
    // ... other trends
  ]

  // Function to fetch details for a specific trend
  const fetchTrendDetails = async (trend: { id: number, trend: string }) => {
    setLoadingTrendId(trend.id);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      // Use the correct, dynamic trend name and encode it for the URL
      const trendName = encodeURIComponent(trend.trend);
      const response = await fetch(`${API_URL}/trend-suggestions/${trendName}`);
      
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      
      const data: Suggestion = await response.json();
      
      setSelectedTrend(data);
      setSelectedTrendTitle(trend.trend);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching suggestions. Please try again.");
    } finally {
      setLoadingTrendId(null); // Stop loading indicator
    }
  };

  const getUrgencyBadge = (urgency: string) => { /* ... same as before ... */ };
  const getDemandIcon = (demand: string) => { /* ... same as before ... */ };

  return (
    <div className="space-y-6">
      {/* ... Header and other static content ... */}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentTrends.map((trend) => (
          <Card key={trend.id} className="border-border">
            {/* ... CardHeader and other content ... */}
            <CardContent className="space-y-4">
              {/* ... description, opportunity, etc. ... */}

              {/* --- THIS IS THE CORRECTED BUTTON --- */}
              <Button
                className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
                onClick={() => fetchTrendDetails(trend)}
                disabled={loadingTrendId === trend.id}
              >
                {loadingTrendId === trend.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Target className="w-4 h-4 mr-2" />
                    Get AI Suggestions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* --- THIS IS THE NEW MODAL FOR DISPLAYING RESULTS --- */}
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
