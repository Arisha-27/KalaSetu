import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Package, 
  Plus, 
  Search,
  Edit,
  Eye,
  AlertTriangle
} from "lucide-react"

export default function InventoryManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const products = [
    {
      id: 1,
      name: "Handwoven Silk Scarf",
      category: "Textiles",
      stock: 12,
      status: "In Stock",
      price: "₹850",
      image: "🧣"
    },
    {
      id: 2,
      name: "Ceramic Tea Set",
      category: "Pottery",
      stock: 5,
      status: "Low Stock",
      price: "₹2,100",
      image: "🫖"
    },
    {
      id: 3,
      name: "Wood Carved Elephant",
      category: "Wood Work",
      stock: 0,
      status: "Out of Stock",
      price: "₹1,450",
      image: "🐘"
    },
    {
      id: 4,
      name: "Silver Jewelry Set",
      category: "Jewelry",
      stock: 8,
      status: "In Stock",
      price: "₹3,200",
      image: "💍"
    },
    {
      id: 5,
      name: "Handmade Candles",
      category: "Home Decor",
      stock: 25,
      status: "In Stock",
      price: "₹320",
      image: "🕯️"
    }
  ]

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>
    } else if (stock <= 5) {
      return <Badge variant="secondary" className="bg-warning text-warning-foreground">Low Stock</Badge>
    } else {
      return <Badge variant="default" className="bg-success text-success-foreground">In Stock</Badge>
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const stockSummary = {
    total: products.length,
    inStock: products.filter(p => p.stock > 5).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock <= 5).length,
    outOfStock: products.filter(p => p.stock === 0).length
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory Management</h1>
            <p className="text-muted-foreground">Track and manage your product stock levels</p>
          </div>
        </div>
        <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{stockSummary.total}</div>
            <div className="text-sm text-muted-foreground">Total Products</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{stockSummary.inStock}</div>
            <div className="text-sm text-muted-foreground">In Stock</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{stockSummary.lowStock}</div>
            <div className="text-sm text-muted-foreground">Low Stock</div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{stockSummary.outOfStock}</div>
            <div className="text-sm text-muted-foreground">Out of Stock</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground">Product Inventory</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 border-border"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-2xl">
                    {product.image}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{product.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{product.category}</span>
                      <span>•</span>
                      <span>{product.price}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium text-foreground">Stock: {product.stock}</div>
                    {getStatusBadge(product.status, product.stock)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    {product.stock <= 5 && (
                      <AlertTriangle className="w-4 h-4 text-warning" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}