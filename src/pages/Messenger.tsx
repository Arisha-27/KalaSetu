import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "../supabaseClient";
import {
  MessageCircle,
  Send,
  Search,
  Paperclip,
  Phone,
  Video,
  MoreVertical,
  Circle,
  Sparkles
} from "lucide-react";

// --- Data Types ---
interface Message {
  id: number | string;
  senderId: string;
  content: string;
  timestamp: string;
}

export default function Messenger() {
  // Get User ID and Role from the URL
  const [searchParams] = useSearchParams();
  const CURRENT_USER_ID = searchParams.get("userId");
  const CURRENT_USER_ROLE = searchParams.get("role");

  // This should be the verified Conversation ID from your database
  const CONVERSATION_ID = "9ed2c3a0-74e8-4457-9789-d79f7efe24fa";

  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const webSocket = useRef<WebSocket | null>(null);

  // --- Mock Data for UI sidebar ---
  const conversations = [
    { id: 1, name: "Priya Sharma", lastMessage: "Click here to start chatting!", timestamp: "2 min ago", unread: 2, status: "online", avatar: "👩‍🦱" },
    { id: 2, name: "Arjun Patel", lastMessage: "Thank you for the beautiful scarf!", timestamp: "1 hour ago", unread: 0, status: "offline", avatar: "👨‍💼" }
  ];
  const [selectedChat, setSelectedChat] = useState(1);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!CURRENT_USER_ID || !CONVERSATION_ID) return;

    // Fetch message history from Supabase
    const fetchMessageHistory = async () => {
      const { data, error } = await supabase.from('messages').select('*').eq('conversation_id', CONVERSATION_ID).order('created_at', { ascending: true });
      if (error) { console.error("Error fetching messages:", error); return; }

      const formattedMessages = data.map((msg: any) => ({
        id: msg.id, senderId: msg.sender_id, content: msg.original_text,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setMessages(formattedMessages);
    };

    fetchMessageHistory();

    // Establish WebSocket connection
    const socket = new WebSocket(`ws://127.0.0.1:8000/ws/${CURRENT_USER_ID}`);
    webSocket.current = socket;

    socket.onopen = () => console.log(`WebSocket for user ${CURRENT_USER_ID} established.`);

    // Listen for new real-time messages
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'message') {
        const newMessage: Message = {
          id: new Date().getTime(), senderId: data.sender_id, content: data.text,
          timestamp: new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      } else if (data.type === 'suggestion') {
        setAiSuggestion(data.text);
      }
    };

    socket.onclose = () => console.log(`WebSocket for user ${CURRENT_USER_ID} closed.`);

    return () => socket.close();

  }, [CURRENT_USER_ID, CONVERSATION_ID]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


  const handleSendMessage = () => {
    if (message.trim() && webSocket.current?.readyState === WebSocket.OPEN) {
      const payload = { conversation_id: CONVERSATION_ID, text: message };
      webSocket.current.send(JSON.stringify(payload));
      const optimisticMessage: Message = {
        id: new Date().getTime(),
        senderId: CURRENT_USER_ID || '',
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
      setMessage("");
      setAiSuggestion(null);
    }
  };

  const handleSuggestionClick = () => {
    if (aiSuggestion) {
      setMessage(aiSuggestion);
      setAiSuggestion(null);
    }
  };

  const getStatusIndicator = (status: string) => (
    <Circle className={`w-3 h-3 ${status === 'online' ? 'text-green-500 fill-current' : 'text-gray-400'}`} />
  );

  const selectedConversation = conversations.find(c => c.id === selectedChat);

  if (!CURRENT_USER_ID) {
    return <div>Loading user... Please ensure userId and role are in the URL.</div>;
  }

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-6">
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
            <Input placeholder="Search conversations..." className="pl-10 border-border" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedChat(conversation.id)}
                className={`p-4 cursor-pointer transition-colors border-b border-border hover:bg-muted/50 ${selectedChat === conversation.id ? 'bg-primary/5 border-l-2 border-l-primary' : ''}`}
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

      <Card className="flex-1 border-border flex flex-col">
        {selectedConversation && (
          <>
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
                  <Button variant="ghost" size="sm"><Phone className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><Video className="w-4 h-4" /></Button>
                  <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === CURRENT_USER_ID ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-lg ${msg.senderId === CURRENT_USER_ID ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                      <p className="text-sm">{msg.content}</p>
                      <span className={`text-xs mt-1 block ${msg.senderId === CURRENT_USER_ID ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="p-4 border-t border-border">
              {CURRENT_USER_ROLE === 'artisan' && aiSuggestion && (
                <div className="mb-2 p-2 bg-muted rounded-md cursor-pointer hover:bg-primary/10 transition-colors" onClick={handleSuggestionClick}>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <Sparkles className="w-4 h-4" />
                    <p className="flex-1 italic"><strong>AI Suggestion:</strong> {aiSuggestion}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm"><Paperclip className="w-4 h-4" /></Button>
                <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." className="flex-1 border-border" onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} />
                <Button onClick={handleSendMessage} className="bg-primary hover:bg-primary-hover text-primary-foreground">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}