import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Camera, 
  Plus, 
  Heart,
  MessageCircle,
  Share,
  Play,
  Image as ImageIcon,
  Clock
} from "lucide-react"

export default function DigitalWorkshop() {
  const [isCreateMode, setIsCreateMode] = useState(false)

  const workshopPosts = [
    {
      id: 1,
      title: "Creating a Ceramic Vase - Day 3",
      description: "The clay is taking shape beautifully! Today I'm working on the neck of the vase. The traditional wheel technique requires patience and steady hands.",
      type: "image",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 8,
      thumbnail: "🏺"
    },
    {
      id: 2,
      title: "Wood Carving Process - Elephant Sculpture",
      description: "Starting the intricate details on the elephant's trunk. This piece will take about 3 weeks to complete. Using traditional chisels passed down from my grandfather.",
      type: "video",
      timestamp: "5 hours ago",
      likes: 31,
      comments: 12,
      thumbnail: "🐘"
    },
    {
      id: 3,
      title: "Silk Weaving Behind the Scenes",
      description: "Setting up the loom for a new silk scarf design. The pattern is inspired by Mughal architecture. Each thread tells a story.",
      type: "image",
      timestamp: "1 day ago",
      likes: 18,
      comments: 6,
      thumbnail: "🧵"
    },
    {
      id: 4,
      title: "Silver Jewelry Making Process",
      description: "Melting silver at exactly 961°C. The ancient techniques of jewelry making require precision and artistry. This will become a beautiful necklace.",
      type: "video",
      timestamp: "2 days ago",
      likes: 42,
      comments: 15,
      thumbnail: "💎"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Camera className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Digital Workshop</h1>
            <p className="text-muted-foreground">Share your creative process and connect with followers</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateMode(!isCreateMode)}
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Share Progress
        </Button>
      </div>

      {/* Create New Post */}
      {isCreateMode && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Share Your Creative Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input 
              placeholder="What are you working on today?"
              className="border-border"
            />
            <Textarea 
              placeholder="Tell your followers about your creative process, techniques, or inspiration..."
              rows={4}
              className="border-border"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  Add Photo
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setIsCreateMode(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  Share Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workshop Posts Feed */}
      <div className="space-y-6">
        {workshopPosts.map((post) => (
          <Card key={post.id} className="border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-3xl">
                  {post.thumbnail}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{post.timestamp}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{post.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {post.type === "video" ? (
                        <Badge variant="outline" className="border-primary text-primary">
                          <Play className="w-3 h-3 mr-1" />
                          Video
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="border-accent text-accent-foreground">
                          <ImageIcon className="w-3 h-3 mr-1" />
                          Photo
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Engagement Stats */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Workshop Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">24</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-dark">1,847</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">342</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">89</div>
              <div className="text-sm text-muted-foreground">Comments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}