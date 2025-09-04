import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  Sparkles, 
  Image as ImageIcon, 
  Video,
  Tag,
  DollarSign,
  FileText,
  Wand2
} from "lucide-react"

export default function AIListingGenerator() {
  const [files, setFiles] = useState<File[]>([])
  const [generatedContent, setGeneratedContent] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    price: ""
  })
  const [isGenerating, setIsGenerating] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || [])
    setFiles(prev => [...prev, ...uploadedFiles])
  }

  const generateListing = async () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      setGeneratedContent({
        title: "Handcrafted Ceramic Vase with Traditional Motifs",
        description: "This exquisite ceramic vase is meticulously handcrafted using traditional pottery techniques passed down through generations. Each piece features unique hand-painted motifs inspired by ancient Indian art forms. The vase stands 12 inches tall and is perfect for displaying fresh flowers or as a standalone decorative piece. Made from high-quality clay and fired at optimal temperatures for durability.",
        tags: ["handmade", "ceramic", "vase", "traditional", "home-decor", "pottery"],
        price: "1450"
      })
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">AI Listing Generator</h1>
          <p className="text-muted-foreground">Upload your product photos/videos and let AI create the perfect listing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Upload className="w-5 h-5" />
              Upload Media
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Drop files here or click to upload
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Support images and videos (Max 10MB each)
                  </div>
                </div>
              </label>
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Uploaded Files:</h4>
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                    {file.type.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4 text-primary" />
                    ) : (
                      <Video className="w-4 h-4 text-primary" />
                    )}
                    <span className="text-sm text-foreground">{file.name}</span>
                  </div>
                ))}
              </div>
            )}

            <Button 
              onClick={generateListing}
              disabled={files.length === 0 || isGenerating}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground"
            >
              {isGenerating ? (
                <div className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4 animate-spin" />
                  Generating...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Generate Listing with AI
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <FileText className="w-5 h-5" />
              Generated Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Product Title</label>
              <Input 
                value={generatedContent.title}
                onChange={(e) => setGeneratedContent(prev => ({ ...prev, title: e.target.value }))}
                placeholder="AI will generate a compelling title..."
                className="border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Description</label>
              <Textarea 
                value={generatedContent.description}
                onChange={(e) => setGeneratedContent(prev => ({ ...prev, description: e.target.value }))}
                placeholder="AI will create a detailed description..."
                rows={6}
                className="border-border"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {generatedContent.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="bg-accent text-accent-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Suggested Price (₹)
              </label>
              <Input 
                value={generatedContent.price}
                onChange={(e) => setGeneratedContent(prev => ({ ...prev, price: e.target.value }))}
                placeholder="AI will suggest optimal pricing..."
                className="border-border"
              />
            </div>

            <Button className="w-full bg-success hover:bg-success/90 text-success-foreground">
              Create Listing
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}