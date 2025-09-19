import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Target, Loader2 } from "lucide-react";

// ... (you can keep your other type definitions and helper functions) ...

export default function AITrendSpotter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [selectedTrendTitle, setSelectedTrendTitle] = useState("");
  const [loadingTrendId, setLoadingTrendId] = useState(null);
  
  // This is the data for the full UI
  const currentTrends = [
    { id: 1, trend: "Festive Diwali Decor", icon: "🪔", urgency: "high", demand: "Rising", description: "...", opportunity: "High", timeframe: "Next 6 weeks", suggestedActions: ["..."] },
    { id: 2, trend: "Winter Wedding Season", icon: "💒", urgency: "very-high", demand: "Surging", description: "...", opportunity: "Very High", timeframe: "Next 12 weeks", suggestedActions: ["..."] },
    { id: 3, trend: "Sustainable Packaging", icon: "🌱", urgency: "medium", demand: "Steady Growth", description: "...", opportunity: "Medium", timeframe: "Long-term", suggestedActions: ["..."] },
    { id: 4, trend: "Personalized Gifts", icon: "🎁", urgency: "high", demand: "Rising", description: "...", opportunity: "High", timeframe: "Ongoing", suggestedActions: ["..."] }
  ];

  const fetchTrendDetails = async (trend) => {
    setLoadingTrendId(trend.id);
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const trendName = encodeURIComponent(trend.trend);
      const response = await fetch(`${API_URL}/trend-suggestions/${trendName}`);
      
      if (!response.ok) throw new Error("API call failed");
      
      const data = await response.json();
      setSelectedTrend(data);
      setSelectedTrendTitle(trend.trend);
      setIsModalOpen(true);
    } catch (err) {
      console.error(err);
      alert("Error fetching suggestions.");
    } finally {
      setLoadingTrendId(null);
    }
  };

  // ... (getUrgencyBadge, getDemandIcon functions) ...
  
  return (
    <div className="space-y-6">
      {/* ... (Your header and other static JSX) ... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {currentTrends.map((trend) => (
          <Card key={trend.id}>
            <CardHeader>
              <CardTitle>{trend.trend}</CardTitle>
              {/* ... Other header details ... */}
            </CardHeader>
            <CardContent>
              <p>{trend.description}</p>
              {/* ... All the other UI details from your localhost version ... */}
              <Button onClick={() => fetchTrendDetails(trend)} disabled={loadingTrendId === trend.id}>
                {loadingTrendId === trend.id ? <Loader2 className="animate-spin" /> : <Target />}
                Get AI Suggestions
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* ... (Your Dialog/Modal JSX) ... */}
    </div>
  );
}
