import os
import json
from datetime import datetime
from typing import Dict, Any, List
import re 

# --- Environment and Configuration ---
from dotenv import load_dotenv
load_dotenv()

# --- Third-Party Imports ---
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
class ListingResponse(BaseModel):
    title: str
    story: str
    tags: List[str]
    suggested_price: str

# --- 3. FastAPI Application ---
app = FastAPI(title="KalaSetu AI Chat Backend")

# This list will automatically allow all your Vercel preview URLs.
origins = [
    "http://localhost:5173",
]
# This regex will match your main URL and any preview URL like: https://kala-setu-....vercel.app
origins.append(re.compile(r"https:\/\/kala-setu-.*\.vercel\.app"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 4. API Endpoint and Data for Trend Spotter ---
trend_suggestions = {
    "Festive Diwali Decor": { "what_to_make": ["Handcrafted diyas", "Torans"], "why_trending": "Upcoming Diwali season", "materials": ["Clay", "Fabric"], "price_range": "₹200-₹800", "source": "Local artisans" },
    "Winter Wedding Season": { "what_to_make": ["Bridal jewelry", "Gift sets"], "why_trending": "Wedding season in North India", "materials": ["Gold plated metal", "Beads"], "price_range": "₹500-₹5000", "source": "Online wholesalers" },
    "Sustainable Packaging": { "what_to_make": ["Biodegradable boxes", "Reusable bags"], "why_trending": "Growing consumer preference", "materials": ["Paper", "Jute"], "price_range": "₹50-₹300", "source": "Eco-friendly suppliers" },
    "Personalized Gifts": { "what_to_make": ["Customized mugs", "Engraved frames"], "why_trending": "Demand for personalized gifts", "materials": ["Ceramic", "Wood"], "price_range": "₹150-₹1000", "source": "Online craft suppliers" }
}

@app.get("/trend-suggestions/{trend_name}")
def get_suggestions(trend_name: str):
    data = trend_suggestions.get(trend_name)
    if not data:
        raise HTTPException(status_code=404, detail="Trend not found")
    return data

# --- 5. API Endpoint for AI Listing Generator ---
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
        cleaned_response_text = response.text.strip().replace("```json", "").replace("```", "")
        response_json = json.loads(cleaned_response_text)
        return ListingResponse(**response_json)
    except Exception as e:
        print(f"Error during AI listing generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate AI content.")
