import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  MessageCircle, 
  Send,
  Search,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Circle
} from "lucide-react"

export default function Messenger() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Priya Sharma",
      lastMessage: "Hi! I'm interested in commissioning a custom ceramic vase. Can you share more details?",
      timestamp: "2 min ago",
      unread: 2,
      status: "online",
      avatar: "👩‍🦱"
    },
    {
      id: 2,
      name: "Arjun Patel",
      lastMessage: "Thank you for the beautiful scarf! When will my next order be ready?",
      timestamp: "1 hour ago",
      unread: 0,
      status: "offline",
      avatar: "👨‍💼"
    },
    {
      id: 3,
      name: "Meera Singh",
      lastMessage: "I love your work! Do you ship internationally?",
      timestamp: "3 hours ago",
      unread: 1,
      status: "online",
      avatar: "👩‍🎨"
    },
    {
      id: 4,
      name: "Rajesh Kumar",
      lastMessage: "Can you create a custom jewelry set for my daughter's wedding?",
      timestamp: "1 day ago",
      unread: 0,
      status: "offline",
      avatar: "👨‍🦳"
    }
  ]

  const messages = [
    {
      id: 1,
      sender: "customer",
      content: "Hi! I saw your ceramic vases on your profile and I'm really impressed with your work.",
      timestamp: "10:30 AM"
    },
    {
      id: 2,
      sender: "artisan",
      content: "Thank you so much! I'm glad you like them. Which piece caught your attention?",
      timestamp: "10:32 AM"
    },
    {
      id: 3,
      sender: "customer",
      content: "The blue and white traditional vase. I'm interested in commissioning something similar but with specific dimensions and colors.",
      timestamp: "10:35 AM"
    },
    {
      id: 4,
      sender: "artisan",
      content: "That sounds wonderful! I'd be happy to create a custom piece for you. Could you share the dimensions and color preferences you have in mind?",
      timestamp: "10:38 AM"
    },
    {
      id: 5,
      sender: "customer",
      content: "I need it to be about 15 inches tall, with earth tones - maybe browns and deep oranges. It's for my living room which has a rustic theme.",
      timestamp: "10:42 AM"
    },
    {
      id: 6,
      sender: "artisan",
      content: "Perfect! Earth tones will look beautiful with traditional motifs. The piece would take about 2-3 weeks to complete. For the size and customization, the price would be ₹2,800. Would that work for you?",
      timestamp: "10:45 AM"
    },
    {
      id: 7,
      sender: "customer",
      content: "That sounds perfect! How do we proceed with the order?",
      timestamp: "Just now"
    }
  ]

  const getStatusIndicator = (status: string) => {
    return (
      <Circle 
        className={`w-3 h-3 ${status === 'online' ? 'text-success fill-current' : 'text-muted-foreground'}`} 
      />
    )
  }

  const selectedConversation = conversations.find(c => c.id === selectedChat)

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("")
    }
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
      {/* Conversations List */}
      <Card className="w-80 border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageCircle className="w-5 h-5" />
              Messages
            </CardTitle>
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {conversations.reduce((sum, c) => sum + c.unread, 0)}
            </Badge>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-10 border-border"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`p-4 cursor-pointer transition-colors border-b border-border hover:bg-muted/50 ${
                  selectedChat === conversation.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xl">
                      {conversation.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      {getStatusIndicator(conversation.status)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground truncate">{conversation.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                        {conversation.unread > 0 && (
                          <Badge className="bg-primary text-primary-foreground text-xs min-w-[20px] h-5 flex items-center justify-center">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 border-border flex flex-col">
        {selectedConversation && (
          <>
            {/* Chat Header */}
            <CardHeader className="pb-3 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xl">
                      {selectedConversation.avatar}
                    </div>
                    <div className="absolute -bottom-1 -right-1">
                      {getStatusIndicator(selectedConversation.status)}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{selectedConversation.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.status === 'online' ? 'Online' : 'Last seen 2 hours ago'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {/* Messages */}
            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'artisan' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] p-3 rounded-lg ${
                        msg.sender === 'artisan'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <span className={`text-xs mt-1 block ${
                        msg.sender === 'artisan' 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            {/* Message Input */}
            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 border-border"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}