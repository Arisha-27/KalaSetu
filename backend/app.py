import os
from datetime import datetime
from typing import Dict, Any

# --- Environment and Configuration ---
from dotenv import load_dotenv
load_dotenv()

# --- Third-Party Imports ---
import uvicorn
import google.generativeai as genai
from supabase import create_client, Client
from deep_translator import GoogleTranslator

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, Field

# --- 1. Client Setup (Supabase, AI) ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')

# --- 2. Pydantic Schemas (using str for UUIDs) ---
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

# --- 3. WebSocket Connection Manager (using str for user_id) ---
class ConnectionManager:
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
            websocket = self.active_connections[user_id]
            await websocket.send_json(data)

manager = ConnectionManager()

# --- 4. AI & Translation Services ---
def translate_text(text: str, target_language: str) -> str:
    """Translates text using the deep-translator library."""
    if not text or not target_language:
        return ""
    try:
        translated_text = GoogleTranslator(source='auto', target=target_language).translate(text)
        print(f"Translated (deep-translator): '{text}' to '{translated_text}' in {target_language}")
        return translated_text
    except Exception as e:
        print(f"Error during translation with deep-translator: {e}")
        return text

async def generate_ai_reply(history: str, new_message: str, target_language: str) -> str:
    """Generates a context-aware reply using Gemini Pro."""
    lang_map = {'hi': 'Hindi', 'en': 'English'}
    language_name = lang_map.get(target_language, 'the user\'s native language')
    
    prompt = (
        "You are a helpful and polite assistant for an Indian artisan. Your goal is to help them "
        "communicate effectively with a buyer. You must reply in the specified language.\n\n"
        "--- Conversation History ---\n"
        f"{history}\n"
        "---------------------------\n\n"
        f"The buyer just sent this message: '{new_message}'\n\n"
        f"Based on the full conversation, generate a polite and professional reply in {language_name} for the artisan to send."
    )
    try:
        response = gemini_model.generate_content(prompt)
        print(f"Generated AI reply: {response.text}")
        return response.text
    except Exception as e:
        print(f"Error generating AI reply: {e}")
        return "Could not generate a reply at this time."

# --- 5. Database Interaction Helpers (Supabase) ---
def get_conversation_and_participants(conversation_id: str, sender_id: str):
    """Fetches conversation, participants, and messages from Supabase."""
    try:
        # Correctly fetches related data from 'profiles' table
        query = supabase.table("conversations").select(
            "*, messages(*, sender:profiles(*)), participants:profiles(*)"
        ).eq("id", conversation_id).single().execute()
        
        conversation_data = query.data
        if not conversation_data: return None, None, None, None
        
        sender = next((p for p in conversation_data['participants'] if p['id'] == sender_id), None)
        recipient = next((p for p in conversation_data['participants'] if p['id'] != sender_id), None)
        return conversation_data, sender, recipient, conversation_data['messages']
    except Exception as e:
        print(f"Error fetching conversation from Supabase: {e}")
        return None, None, None, None

def save_message_to_db(conversation_id: str, sender_id: str, text: str):
    """Saves a new message to the Supabase database."""
    try:
        supabase.table("messages").insert({
            "conversation_id": conversation_id, "sender_id": sender_id, "original_text": text
        }).execute()
    except Exception as e:
        print(f"Error saving message to Supabase: {e}")

# --- 6. FastAPI Application and WebSocket Endpoint ---
app = FastAPI(title="KalaSetu AI Chat Backend")

# The on_startup function has been removed as your database is already populated.
# The application will now connect to your existing data.

@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            incoming = IncomingMessage(**data)

            save_message_to_db(incoming.conversation_id, user_id, incoming.text)
            
            _, sender, recipient, messages = get_conversation_and_participants(
                incoming.conversation_id, user_id
            )

            if not (sender and recipient):
                # Ensure we only try to send a message if recipient is online
                if manager.active_connections.get(user_id):
                    await manager.send_json(user_id, {"error": "Invalid conversation or user."})
                continue
            
            translated_for_recipient = translate_text(incoming.text, recipient['language_preference'])
            
            outgoing_msg = OutgoingMessage(
                conversation_id=incoming.conversation_id, sender_id=user_id, text=translated_for_recipient
            )
            # Ensure we only try to send a message if recipient is online
            if manager.active_connections.get(recipient['id']):
                 await manager.send_json(recipient['id'], outgoing_msg.dict())

            if recipient['role'] == 'artisan':
                sorted_messages = sorted(messages, key=lambda m: m.get('created_at', ''))
                history_list = [f"{'Buyer' if msg['sender']['role'] == 'buyer' else 'Artisan'}: {msg['original_text']}" for msg in sorted_messages]
                history_list.append(f"{'Buyer' if sender['role'] == 'buyer' else 'Artisan'}: {incoming.text}")
                history_str = "\n".join(history_list)

                ai_reply_text = await generate_ai_reply(
                    history=history_str,
                    new_message=translated_for_recipient,
                    target_language=recipient['language_preference']
                )
                
                suggestion = AiSuggestion(
                    conversation_id=incoming.conversation_id, text=ai_reply_text
                )
                # Ensure we only try to send a message if recipient is online
                if manager.active_connections.get(recipient['id']):
                    await manager.send_json(recipient['id'], suggestion.dict())

    except WebSocketDisconnect:
        manager.disconnect(user_id)
    except Exception as e:
        print(f"An error occurred with user {user_id}: {e}")
        manager.disconnect(user_id)

# --- How to Run ---
# In your terminal, run: uvicorn app:app --reload
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
