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
  Clock,
  Users,
  Eye,
  Palette,
  Sparkles
} from "lucide-react"

// Import workshop images
import potteryWorkshop from "@/assets/pottery-workshop.jpg"
import woodCarving from "@/assets/wood-carving.jpg"
import silkWeaving from "@/assets/silk-weaving.jpg"
import jewelryMaking from "@/assets/jewelry-making.jpg"

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
      image: potteryWorkshop,
      color: "from-primary to-purple",
      accent: "text-primary"
    },
    {
      id: 2,
      title: "Wood Carving Process - Elephant Sculpture",
      description: "Starting the intricate details on the elephant's trunk. This piece will take about 3 weeks to complete. Using traditional chisels passed down from my grandfather.",
      type: "video",
      timestamp: "5 hours ago",
      likes: 31,
      comments: 12,
      image: woodCarving,
      color: "from-purple to-coral",
      accent: "text-purple"
    },
    {
      id: 3,
      title: "Silk Weaving Behind the Scenes",
      description: "Setting up the loom for a new silk scarf design. The pattern is inspired by Mughal architecture. Each thread tells a story.",
      type: "image",
      timestamp: "1 day ago",
      likes: 18,
      comments: 6,
      image: silkWeaving,
      color: "from-coral to-medium-blue",
      accent: "text-coral"
    },
    {
      id: 4,
      title: "Silver Jewelry Making Process",
      description: "Melting silver at exactly 961°C. The ancient techniques of jewelry making require precision and artistry. This will become a beautiful necklace.",
      type: "video",
      timestamp: "2 days ago",
      likes: 42,
      comments: 15,
      image: jewelryMaking,
      color: "from-medium-blue to-accent",
      accent: "text-medium-blue"
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-purple rounded-2xl flex items-center justify-center shadow-lg animate-glow">
            <Camera className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Digital Workshop</h1>
            <p className="text-muted-foreground text-lg">Share your creative process and connect with followers</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateMode(!isCreateMode)}
          className="bg-gradient-to-r from-primary to-purple hover:from-primary/90 hover:to-purple/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Share Progress
        </Button>
      </div>

      {/* Create New Post */}
      {isCreateMode && (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple/5 animate-scale-in">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple/10 rounded-t-lg">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Share Your Creative Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            <Input 
              placeholder="What are you working on today?"
              className="border-primary/20 focus:border-primary"
            />
            <Textarea 
              placeholder="Tell your followers about your creative process, techniques, or inspiration..."
              rows={4}
              className="border-primary/20 focus:border-primary"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" className="border-purple/20 text-purple hover:bg-purple/10">
                  <Camera className="w-4 h-4 mr-2" />
                  Add Photo
                </Button>
                <Button variant="outline" size="sm" className="border-coral/20 text-coral hover:bg-coral/10">
                  <Play className="w-4 h-4 mr-2" />
                  Add Video
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setIsCreateMode(false)}>
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-primary to-purple hover:from-primary/90 hover:to-purple/90 text-primary-foreground">
                  Share Progress
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Workshop Posts Feed */}
      <div className="space-y-8">
        {workshopPosts.map((post, index) => (
          <Card 
            key={post.id} 
            className="border-border hover:shadow-2xl transition-all duration-500 hover:scale-102 overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className={`h-2 bg-gradient-to-r ${post.color}`}></div>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-80 object-cover hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4">
                    {post.type === "video" ? (
                      <Badge className="bg-coral text-coral-foreground shadow-lg">
                        <Play className="w-3 h-3 mr-1" />
                        Video
                      </Badge>
                    ) : (
                      <Badge className="bg-accent text-accent-foreground shadow-lg">
                        <Camera className="w-3 h-3 mr-1" />
                        Photo
                      </Badge>
                    )}
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 text-muted-foreground bg-black/50 backdrop-blur px-2 py-1 rounded-full text-white">
                      <Clock className="w-3 h-3" />
                      <span className="text-xs">{post.timestamp}</span>
                    </div>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-xl text-foreground leading-tight">{post.title}</h3>
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${post.color} flex items-center justify-center`}>
                        <Palette className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-6 leading-relaxed">{post.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-coral hover:bg-coral/10 transition-colors">
                        <Heart className="w-4 h-4 mr-2" />
                        <span className="font-medium">{post.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        <span className="font-medium">{post.comments}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-purple hover:bg-purple/10 transition-colors">
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

      {/* Engagement Stats with Colorful Design */}
      <Card className="border-2 border-accent/20 bg-gradient-to-r from-accent/5 to-light-blue/5">
        <CardHeader className="bg-gradient-to-r from-accent/10 to-light-blue/10 rounded-t-lg">
          <CardTitle className="text-foreground flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-light-blue rounded-lg flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            Workshop Analytics
            <Badge className="ml-auto bg-gradient-to-r from-accent to-light-blue text-white">Growing</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/20">
              <div className="text-3xl font-bold text-primary mb-1">24</div>
              <div className="text-sm text-muted-foreground">Total Posts</div>
            </div>
            <div className="text-center p-4 bg-purple/5 rounded-xl border border-purple/20">
              <div className="text-3xl font-bold text-purple mb-1">1,847</div>
              <div className="text-sm text-muted-foreground">Total Views</div>
            </div>
            <div className="text-center p-4 bg-coral/5 rounded-xl border border-coral/20">
              <div className="text-3xl font-bold text-coral mb-1">342</div>
              <div className="text-sm text-muted-foreground">Total Likes</div>
            </div>
            <div className="text-center p-4 bg-medium-blue/5 rounded-xl border border-medium-blue/20">
              <div className="text-3xl font-bold text-medium-blue mb-1">89</div>
              <div className="text-sm text-muted-foreground">Comments</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}