from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow frontend requests
origins = [
    # For local development
    "http://localhost:5173",
    # Your live Vercel URLs
    "https://kala-setu-seven.vercel.app",
    "https://kala-setu-1tw6rab-arisha-27s-projects.vercel.app"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dummy suggestion data
trend_suggestions = {
    "Festive Diwali Decor": {
        "what_to_make": ["Handcrafted diyas", "Torans", "Ethnic home decor"],
        "why_trending": "Upcoming Diwali season, high demand for festive home decorations",
        "materials": ["Clay", "Fabric", "Paint", "Beads"],
        "price_range": "₹200-₹800",
        "source": "Local artisans, wholesale craft suppliers"
    },
    "Winter Wedding Season": {
        "what_to_make": ["Bridal jewelry", "Ceremonial items", "Wedding gift sets"],
        "why_trending": "Wedding season approaching in North India",
        "materials": ["Gold plated metal", "Beads", "Fabric", "Stones"],
        "price_range": "₹500-₹5000",
        "source": "Local jewelers, online wholesalers"
    },
    "Sustainable Packaging": {
        "what_to_make": ["Biodegradable boxes", "Eco-friendly wraps", "Reusable bags"],
        "why_trending": "Growing consumer preference for sustainable products",
        "materials": ["Paper", "Kraft", "Jute", "Plant-based plastics"],
        "price_range": "₹50-₹300",
        "source": "Eco-friendly packaging suppliers"
    },
    "Personalized Gifts": {
        "what_to_make": ["Customized mugs", "Engraved photo frames", "Name keychains"],
        "why_trending": "Rising demand for personalized gifts for birthdays & anniversaries",
        "materials": ["Ceramic", "Wood", "Acrylic", "Metal"],
        "price_range": "₹150-₹1000",
        "source": "Online craft suppliers, printing shops"
    }
}

@app.get("/trend-suggestions/{trend_name}")
def get_suggestions(trend_name: str):
    data = trend_suggestions.get(trend_name)
    if not data:
        return {"error": "Trend not found"}
    return data
