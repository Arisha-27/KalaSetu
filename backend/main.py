# backend/main.py
import os
import json
import joblib
import pandas as pd
from fastapi import FastAPI, File, UploadFile
from pydantic import BaseModel
import google.generativeai as genai

# -----------------------------
# 1. FastAPI setup
# -----------------------------
app = FastAPI()

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# Load ML model
MODEL_PATH = "price_model.pkl"
try:
    model = joblib.load(MODEL_PATH)
except:
    model = None

# -----------------------------
# 2. ML training helper
# -----------------------------
def train_price_model(dataset_path="artisan_dataset.csv"):
    df = pd.read_csv(dataset_path)
    df_encoded = pd.get_dummies(df.drop('price', axis=1))
    y = df['price']
    from sklearn.model_selection import train_test_split
    from sklearn.ensemble import RandomForestRegressor

    X_train, X_test, y_train, y_test = train_test_split(df_encoded, y, test_size=0.2, random_state=42)
    rf = RandomForestRegressor(n_estimators=200, random_state=42)
    rf.fit(X_train, y_train)
    joblib.dump(rf, MODEL_PATH)
    print("Model trained & saved!")
    return rf, X_train.columns

if model is None:
    model, feature_columns = train_price_model()
else:
    feature_columns = model.feature_names_in_

# -----------------------------
# 3. API Models
# -----------------------------
class ProductOutput(BaseModel):
    title: str
    description: str
    predicted_price: float

# -----------------------------
# 4. Gemini API calls
# -----------------------------
def call_gemini_vision(image_bytes):
    """
    Gemini Vision API: extract raw tags
    """
    model_v = genai.GenerativeModel("gemini-1.5-flash")
    response = model_v.generate_content([
        {"mime_type": "image/jpeg", "data": image_bytes},
        "Extract product attributes like product_type, material, color, style, region."
    ])
    return response.text  # e.g., "brown handwoven bamboo basket"

def map_tags_to_schema(raw_tags):
    """
    Gemini Text API: map raw tags to fixed schema + generate title/description
    """
    model_t = genai.GenerativeModel("gemini-1.5-flash")
    prompt = f"""
    Convert the following raw product tags into JSON:
    Fields: product_type, material, color, style, region, title, description
    Raw tags: {raw_tags}
    """
    response = model_t.generate_content(prompt)
    schema = json.loads(response.text)  # Gemini should output valid JSON
    return schema

# -----------------------------
# 5. Price prediction
# -----------------------------
def predict_price(schema, feature_columns):
    df = pd.DataFrame([schema])
    df_encoded = pd.get_dummies(df.drop(['title', 'description'], axis=1))
    for col in feature_columns:
        if col not in df_encoded.columns:
            df_encoded[col] = 0
    df_encoded = df_encoded[feature_columns]
    return model.predict(df_encoded)[0]

# -----------------------------
# 6. FastAPI endpoint
# -----------------------------
@app.post("/generate_listing", response_model=ProductOutput)
async def generate_listing(file: UploadFile = File(...)):
    image_bytes = await file.read()
    raw_tags = call_gemini_vision(image_bytes)
    schema = map_tags_to_schema(raw_tags)
    predicted_price = predict_price(schema, feature_columns)
    return ProductOutput(
        title=schema["title"],
        description=schema["description"],
        predicted_price=round(predicted_price, 2)
    )

# -----------------------------
# Run: uvicorn main:app --reload
# -----------------------------
