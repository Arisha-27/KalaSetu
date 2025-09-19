import os
import json
import re
from typing import List
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
from pydantic import BaseModel
import PIL.Image
import io

# --- Setup ---
# It's good practice to load environment variables at the start if you use a .env file locally
from dotenv import load_dotenv
load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
gemini_model = genai.GenerativeModel('gemini-1.5-flash')
app = FastAPI(title="KalaSetu AI Backend")

# --- CORS Configuration (Permanent Fix) ---
origins = [
    "http://localhost:5173", # Default Vite port for local dev
]
# This regex will match your main URL and ANY preview URL like: https://kala-setu-....vercel.app
origins.append(re.compile(r"https:\/\/kala-setu-.*\.vercel\.app"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class ListingResponse(BaseModel):
    title: str
    story: str
    tags: List[str]
    suggested_price: str

# --- API Endpoints ---
trend_suggestions = {
    "Festive Diwali Decor": {"what_to_make": ["Handcrafted diyas", "Torans"], "why_trending": "Upcoming Diwali season", "materials": ["Clay", "Fabric"], "price_range": "₹200-₹800", "source": "Local artisans"},
    "Winter Wedding Season": {"what_to_make": ["Bridal jewelry", "Gift sets"], "why_trending": "Wedding season in North India", "materials": ["Gold plated metal", "Beads"], "price_range": "₹500-₹5000", "source": "Online wholesalers"},
    "Sustainable Packaging": {"what_to_make": ["Biodegradable boxes", "Reusable bags"], "why_trending": "Growing consumer preference", "materials": ["Paper", "Jute"], "price_range": "₹50-₹300", "source": "Eco-friendly suppliers"},
    "Personalized Gifts": {"what_to_make": ["Customized mugs", "Engraved frames"], "why_trending": "Demand for personalized gifts", "materials": ["Ceramic", "Wood"], "price_range": "₹150-₹1000", "source": "Online craft suppliers"}
}

@app.get("/trend-suggestions/{trend_name}")
def get_suggestions(trend_name: str):
    data = trend_suggestions.get(trend_name)
    if not data:
        raise HTTPException(status_code=404, detail="Trend not found")
    return data

@app.post("/upload-image", response_model=ListingResponse)
async def generate_listing(image: UploadFile = File(...)):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File is not an image.")
    try:
        contents = await image.read()
        pil_image = PIL.Image.open(io.BytesIO(contents))
        prompt = [
            "You are a marketing expert for handcrafted Indian goods. Analyze this product image. Generate a product title, a compelling story, SEO tags, and a suggested price in INR. Respond with only a valid JSON object: {\"title\": \"...\", \"story\": \"...\", \"tags\": [\"...\"], \"suggested_price\": \"₹...\"}",
            pil_image
        ]
        response = gemini_model.generate_content(prompt)
        cleaned_response_text = response.text.strip().replace("```json", "").replace("```", "")
        response_json = json.loads(cleaned_response_text)
        return ListingResponse(**response_json)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate content: {e}")
