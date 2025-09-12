import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Users, 
  Search,
  MapPin,
  Star,
  MessageCircle,
  Eye,
  Plus,
  Filter,
  Heart,
  Handshake
} from "lucide-react"

export default function CollaborationFinder() {
  const [searchTerm, setSearchTerm] = useState("")

  const artisans = [
    {
      id: 1,
      name: "Kavya Textile Arts",
      location: "Varanasi, Uttar Pradesh",
      speciality: "Silk Weaving",
      experience: "15+ years",
      rating: 4.9,
      reviews: 127,
      projects: 23,
      looking: "Embroidery artists for silk scarf collaboration",
      skills: ["Traditional Weaving", "Natural Dyeing", "Silk Processing"],
      portfolio: ["🧵", "🎨", "✨"],
      verified: true
    },
    {
      id: 2,
      name: "Ravi Wood Crafts",
      location: "Saharanpur, Uttar Pradesh",
      speciality: "Wood Carving",
      experience: "12+ years",
      rating: 4.8,
      reviews: 89,
      projects: 31,
      looking: "Metal artists for decorative inlay work",
      skills: ["Fine Carving", "Furniture Making", "Restoration"],
      portfolio: ["🪵", "🔨", "🎯"],
      verified: true
    },
    {
      id: 3,
      name: "Anita Silver Studio",
      location: "Jaipur, Rajasthan",
      speciality: "Silver Jewelry",
      experience: "8+ years",
      rating: 4.7,
      reviews: 156,
      projects: 18,
      looking: "Gemstone setters and enamel artists",
      skills: ["Silver Smithing", "Traditional Designs", "Custom Jewelry"],
      portfolio: ["💍", "⚡", "🌟"],
      verified: false
    },
    {
      id: 4,
      name: "Deepak Pottery Works",
      location: "Khurja, Uttar Pradesh",
      speciality: "Ceramic Art",
      experience: "20+ years",
      rating: 4.9,
      reviews: 203,
      projects: 45,
      looking: "Painters for ceramic decoration collaboration",
      skills: ["Wheel Throwing", "Glazing", "Traditional Pottery"],
      portfolio: ["🏺", "🎨", "🔥"],
      verified: true
    }
  ]

  const collaborationRequests = [
    {
      id: 1,
      title: "Traditional Rajasthani Wedding Collection",
      requester: "Sita Embroidery Arts",
      location: "Jodhpur, Rajasthan",
      description: "Looking for skilled jewelry makers and textile artists to create a premium wedding collection featuring traditional Rajasthani designs.",
      skills_needed: ["Jewelry Making", "Gold Work", "Mirror Work"],
      budget: "₹50,000 - ₹75,000",
      timeline: "6-8 weeks",
      applicants: 12,
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Modern Fusion Home Decor Line",
      requester: "Urban Craft Collective",
      location: "Mumbai, Maharashtra",
      description: "Collaborative project to create contemporary home decor items with traditional craft techniques. Need pottery, metalwork, and textile specialists.",
      skills_needed: ["Pottery", "Metal Work", "Textile Design"],
      budget: "₹80,000 - ₹1,20,000",
      timeline: "10-12 weeks",
      applicants: 8,
      posted: "5 days ago"
    },
    {
      id: 3,
      title: "Export Quality Handicraft Series",
      requester: "Global Artisan Network",
      location: "Delhi, India",
      description: "International buyer seeking artisans for premium handicraft collection. Focus on quality and authenticity.",
      skills_needed: ["Wood Carving", "Painting", "Finishing"],
      budget: "₹1,00,000 - ₹2,00,000",
      timeline: "12-16 weeks",
      applicants: 24,
      posted: "1 week ago"
    }
  ]

  const myCollaborations = [
    {
      id: 1,
      project: "Festive Table Setting Collection",
      partner: "Ceramic Master Arun",
      status: "In Progress",
      completion: 65,
      deadline: "Oct 30, 2024"
    },
    {
      id: 2,
      project: "Wedding Jewelry & Accessories",
      partner: "Silver Artist Priya",
      status: "Completed",
      completion: 100,
      deadline: "Sep 15, 2024"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Progress":
        return <Badge className="bg-warning text-warning-foreground">In Progress</Badge>
      case "Completed":
        return <Badge className="bg-success text-success-foreground">Completed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Collaboration Finder</h1>
            <p className="text-muted-foreground">Connect with fellow artisans for collaborative projects</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Post Project
        </Button>
      </div>

      <Tabs defaultValue="find-artisans" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="find-artisans">Find Artisans</TabsTrigger>
          <TabsTrigger value="collaboration-requests">Project Requests</TabsTrigger>
          <TabsTrigger value="my-collaborations">My Collaborations</TabsTrigger>
        </TabsList>

        <TabsContent value="find-artisans" className="space-y-4">
          {/* Search and Filter */}
          <Card className="border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search by skill, location, or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-border"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Artisans Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {artisans.map((artisan) => (
              <Card key={artisan.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground">{artisan.name}</h3>
                          {artisan.verified && (
                            <Badge className="bg-success text-success-foreground text-xs">Verified</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-sm">
                          <MapPin className="w-3 h-3" />
                          {artisan.location}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Badge variant="outline" className="mb-2">{artisan.speciality}</Badge>
                      <p className="text-sm text-muted-foreground">{artisan.looking}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-accent-dark fill-current" />
                        <span className="font-medium text-foreground">{artisan.rating}</span>
                        <span className="text-muted-foreground">({artisan.reviews})</span>
                      </div>
                      <div className="text-muted-foreground">{artisan.experience}</div>
                      <div className="text-muted-foreground">{artisan.projects} projects</div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {artisan.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {artisan.portfolio.map((emoji, index) => (
                          <span key={index} className="text-lg">{emoji}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="collaboration-requests" className="space-y-4">
          <div className="space-y-4">
            {collaborationRequests.map((request) => (
              <Card key={request.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{request.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>by {request.requester}</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {request.location}
                        </div>
                        <span>•</span>
                        <span>{request.posted}</span>
                      </div>
                    </div>
                    <Badge variant="outline">{request.applicants} applicants</Badge>
                  </div>

                  <p className="text-muted-foreground mb-4">{request.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">Budget</div>
                      <div className="text-sm text-muted-foreground">{request.budget}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">Timeline</div>
                      <div className="text-sm text-muted-foreground">{request.timeline}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-sm font-medium text-foreground mb-1">Skills Needed</div>
                      <div className="flex flex-wrap gap-1">
                        {request.skills_needed.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                    <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                      <Handshake className="w-4 h-4 mr-1" />
                      Apply for Collaboration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-collaborations" className="space-y-4">
          <div className="space-y-4">
            {myCollaborations.map((collab) => (
              <Card key={collab.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{collab.project}</h3>
                      <div className="text-sm text-muted-foreground">
                        with {collab.partner}
                      </div>
                    </div>
                    {getStatusBadge(collab.status)}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-foreground">Progress</span>
                        <span className="text-muted-foreground">{collab.completion}%</span>
                      </div>
                      <div className="w-full h-2 bg-muted rounded-full">
                        <div 
                          className="h-full bg-primary rounded-full transition-all" 
                          style={{ width: `${collab.completion}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Deadline: {collab.deadline}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          View Project
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}