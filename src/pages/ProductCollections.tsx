import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  FolderOpen, 
  Plus, 
  Edit,
  Eye,
  Package,
  Star,
  Calendar
} from "lucide-react"

export default function ProductCollections() {
  const [isCreateMode, setIsCreateMode] = useState(false)

  const collections = [
    {
      id: 1,
      name: "Festive Diwali Collection",
      description: "Handcrafted items perfect for Diwali celebrations",
      productCount: 12,
      status: "Active",
      createdDate: "Oct 15, 2024",
      totalRevenue: "₹18,450",
      featured: true,
      thumbnail: "🪔"
    },
    {
      id: 2,
      name: "Wedding Gift Collection",
      description: "Elegant pieces ideal for wedding ceremonies and gifts",
      productCount: 8,
      status: "Active",
      createdDate: "Sep 22, 2024",
      totalRevenue: "₹24,600",
      featured: false,
      thumbnail: "💒"
    },
    {
      id: 3,
      name: "Monsoon Special",
      description: "Cozy and warm handmade items for the rainy season",
      productCount: 15,
      status: "Draft",
      createdDate: "Aug 12, 2024",
      totalRevenue: "₹8,920",
      featured: false,
      thumbnail: "🌧️"
    },
    {
      id: 4,
      name: "Traditional Pottery",
      description: "Authentic ceramic pieces using traditional techniques",
      productCount: 6,
      status: "Active",
      createdDate: "Jul 30, 2024",
      totalRevenue: "₹15,200",
      featured: true,
      thumbnail: "🏺"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-success text-success-foreground">Active</Badge>
      case "Draft":
        return <Badge variant="secondary" className="bg-warning text-warning-foreground">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <FolderOpen className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Collections</h1>
            <p className="text-muted-foreground">Organize your products into themed collections</p>
          </div>
        </div>
        <Button 
          onClick={() => setIsCreateMode(!isCreateMode)}
          className="bg-primary hover:bg-primary-hover text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Collection
        </Button>
      </div>

      {/* Create New Collection */}
      {isCreateMode && (
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Create New Collection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Collection Name</label>
                <Input 
                  placeholder="e.g., Summer Collection 2024"
                  className="border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                <Input 
                  placeholder="e.g., Seasonal, Occasion-specific"
                  className="border-border"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
              <Input 
                placeholder="Brief description of this collection..."
                className="border-border"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="featured" className="rounded" />
                <label htmlFor="featured" className="text-sm text-foreground">
                  Mark as featured collection
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setIsCreateMode(false)}>
                  Cancel
                </Button>
                <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  Create Collection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Collections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {collections.map((collection) => (
          <Card key={collection.id} className="border-border hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                    {collection.thumbnail}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{collection.name}</h3>
                      {collection.featured && (
                        <Star className="w-4 h-4 text-accent-dark fill-current" />
                      )}
                    </div>
                    {getStatusBadge(collection.status)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground text-sm mb-4">{collection.description}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Package className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-lg font-semibold text-foreground">{collection.productCount}</div>
                  <div className="text-xs text-muted-foreground">Products</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-lg font-semibold text-success">{collection.totalRevenue}</div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Created {collection.createdDate}</span>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  Manage Products
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Collection Statistics */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Collection Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{collections.length}</div>
              <div className="text-sm text-muted-foreground">Total Collections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {collections.reduce((sum, c) => sum + c.productCount, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Products in Collections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-dark">
                {collections.filter(c => c.status === "Active").length}
              </div>
              <div className="text-sm text-muted-foreground">Active Collections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                ₹{collections.reduce((sum, c) => sum + parseInt(c.totalRevenue.replace(/[₹,]/g, '')), 0).toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Revenue</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}