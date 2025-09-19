import os
import json
from datetime import datetime
from typing import Dict, Any, List

# --- Environment and Configuration ---
from dotenv import load_dotenv
load_dotenv()

# --- Third-Party Imports ---
import uvicorn
import google.generativeai as genai
from supabase import create_client, Client
from deep_translator import GoogleTranslator

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import PIL.Image
import io

# --- 1. Client Setup (Supabase, AI) ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

# --- 2. Pydantic Schemas ---
class IncomingMessage(BaseModel):
    conversation_id: str
    text: str

class OutgoingMessage(BaseModel):
    type: str = "message"
    conversation_id: str
    sender_id: str
    text: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

class AiSuggestion(BaseModel):
    type: str = "suggestion"
    conversation_id: str
    text: str

# --- NEW: Pydantic models for Listing Generator ---
class ListingResponse(BaseModel):
    title: str
    story: str
    tags: List[str]
    suggested_price: str


# --- 3. FastAPI Application ---
app = FastAPI(title="KalaSetu AI Chat Backend")

# --- NEW: CORS Middleware (to fix connection errors) ---
origins = [
    "http://localhost", "http://localhost:8080", "http://localhost:8081",
    "http://localhost:8082", "http://localhost:8083", "http://localhost:8084",
    "http://localhost:5173", # Add any other ports your frontend uses
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 4. WebSocket Connection Manager & Logic (Existing Chat Feature) ---
class ConnectionManager:
    # ... (ConnectionManager class remains the same)
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    async def connect(self, user_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        print(f"User {user_id} connected.")
    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            print(f"User {user_id} disconnected.")
    async def send_json(self, user_id: str, data: dict):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_json(data)

manager = ConnectionManager()

def translate_text(text: str, target_language: str) -> str:
    # ... (translate_text function remains the same)
    if not text or not target_language: return ""
    try:
        return GoogleTranslator(source='auto', target=target_language).translate(text)
    except Exception as e:
        print(f"Error during translation: {e}")
        return text

async def generate_ai_reply(history: str, new_message: str, target_language: str) -> str:
    # ... (generate_ai_reply function remains the same)
    lang_map = {'hi': 'Hindi', 'en': 'English'}
    language_name = lang_map.get(target_language, 'the user\'s native language')
    prompt = (f"You are a helpful assistant for an Indian artisan. Based on the conversation history:\n\n---\n{history}\n---\n\nThe buyer just said: '{new_message}'. Generate a polite reply in {language_name}.")
    try:
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"Error generating AI reply: {e}")
        return "Could not generate a reply."

def get_conversation_and_participants(conversation_id: str, sender_id: str):
    # ... (get_conversation_and_participants function remains the same)
    try:
        query = supabase.table("conversations").select("*, messages(*, sender:profiles(*)), participants:profiles(*)").eq("id", conversation_id).single().execute()
        d = query.data
        if not d: return None, None, None, None
        s = next((p for p in d['participants'] if p['id'] == sender_id), None)
        r = next((p for p in d['participants'] if p['id'] != sender_id), None)
        return d, s, r, d['messages']
    except Exception as e:
        print(f"Error fetching conversation: {e}")
        return None, None, None, None

def save_message_to_db(conversation_id: str, sender_id: str, text: str):
    # ... (save_message_to_db function remains the same)
    try:
        supabase.table("messages").insert({"conversation_id": conversation_id, "sender_id": sender_id, "original_text": text}).execute()
    except Exception as e:
        print(f"Error saving message: {e}")

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    # ... (websocket_endpoint function remains the same)
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            incoming = IncomingMessage(**data)
            save_message_to_db(incoming.conversation_id, user_id, incoming.text)
            _, sender, recipient, messages = get_conversation_and_participants(incoming.conversation_id, user_id)
            if not (sender and recipient):
                if manager.active_connections.get(user_id):
                    await manager.send_json(user_id, {"error": "Invalid conversation or user."})
                continue
            translated = translate_text(incoming.text, recipient['language_preference'])
            outgoing_msg = OutgoingMessage(conversation_id=incoming.conversation_id, sender_id=user_id, text=translated)
            if manager.active_connections.get(recipient['id']):
                 await manager.send_json(recipient['id'], outgoing_msg.dict())
            if recipient['role'] == 'artisan':
                history = "\n".join([f"{'Buyer' if m['sender']['role'] == 'buyer' else 'Artisan'}: {m['original_text']}" for m in sorted(messages, key=lambda m: m.get('created_at', ''))])
                history += f"\n{'Buyer' if sender['role'] == 'buyer' else 'Artisan'}: {incoming.text}"
                ai_reply = await generate_ai_reply(history, translated, recipient['language_preference'])
                suggestion = AiSuggestion(conversation_id=incoming.conversation_id, text=ai_reply)
                if manager.active_connections.get(recipient['id']):
                    await manager.send_json(recipient['id'], suggestion.dict())
    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"An error occurred with user {user_id}: {e}")
        manager.disconnect(user_id)


# --- 5. NEW: API Endpoint for AI Listing Generator ---
@app.post("/upload-image", response_model=ListingResponse)
async def generate_listing(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    try:
        contents = await image.read()
        pil_image = PIL.Image.open(io.BytesIO(contents))
        
        prompt = [
            "You are an expert in marketing handcrafted goods from India. Analyze this image of an artisan's product. Your task is to generate a product title, a compelling story, relevant SEO tags, and a suggested price in INR. Respond with only a valid JSON object in the following format: {\"title\": \"...\", \"story\": \"...\", \"tags\": [\"...\", \"...\"], \"suggested_price\": \"₹...\"}",
            pil_image
        ]
        
        response = gemini_model.generate_content(prompt)
        
        # Clean up the response to ensure it's valid JSON
        cleaned_response_text = response.text.strip().replace("```json", "").replace("```", "")
        
        response_json = json.loads(cleaned_response_text)

        return ListingResponse(
            title=response_json.get("title", "AI Title Generation Failed"),
            story=response_json.get("story", "Could not generate a story for this product."),
            tags=response_json.get("tags", []),
            suggested_price=response_json.get("suggested_price", "₹0")
        )

    except Exception as e:
        print(f"Error during AI listing generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate AI content.")


# --- How to Run ---
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)