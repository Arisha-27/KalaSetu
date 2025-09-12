# # backend/main.py
# import os
# import json
# import joblib
# import pandas as pd
# from fastapi import FastAPI, File, UploadFile
# from pydantic import BaseModel
# import google.generativeai as genai

# # -----------------------------
# # 1. FastAPI setup
# # -----------------------------
# app = FastAPI()

# # Configure Gemini
# genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

# # Load ML model
# MODEL_PATH = "price_model.pkl"
# try:
#     model = joblib.load(MODEL_PATH)
# except:
#     model = None

# # -----------------------------
# # 2. ML training helper
# # -----------------------------
# def train_price_model(dataset_path="artisan_dataset.csv"):
#     df = pd.read_csv(dataset_path)
#     df_encoded = pd.get_dummies(df.drop('price', axis=1))
#     y = df['price']
#     from sklearn.model_selection import train_test_split
#     from sklearn.ensemble import RandomForestRegressor

#     X_train, X_test, y_train, y_test = train_test_split(df_encoded, y, test_size=0.2, random_state=42)
#     rf = RandomForestRegressor(n_estimators=200, random_state=42)
#     rf.fit(X_train, y_train)
#     joblib.dump(rf, MODEL_PATH)
#     print("Model trained & saved!")
#     return rf, X_train.columns

# if model is None:
#     model, feature_columns = train_price_model()
# else:
#     feature_columns = model.feature_names_in_

# # -----------------------------
# # 3. API Models
# # -----------------------------
# class ProductOutput(BaseModel):
#     title: str
#     description: str
#     predicted_price: float

# # -----------------------------
# # 4. Gemini API calls
# # -----------------------------
# def call_gemini_vision(image_bytes):
#     """
#     Gemini Vision API: extract raw tags
#     """
#     model_v = genai.GenerativeModel("gemini-1.5-flash")
#     response = model_v.generate_content([
#         {"mime_type": "image/jpeg", "data": image_bytes},
#         "Extract product attributes like product_type, material, color, style, region."
#     ])
#     return response.text  # e.g., "brown handwoven bamboo basket"

# def map_tags_to_schema(raw_tags):
#     """
#     Gemini Text API: map raw tags to fixed schema + generate title/description
#     """
#     model_t = genai.GenerativeModel("gemini-1.5-flash")
#     prompt = f"""
#     Convert the following raw product tags into JSON:
#     Fields: product_type, material, color, style, region, title, description
#     Raw tags: {raw_tags}
#     """
#     response = model_t.generate_content(prompt)
#     schema = json.loads(response.text)  # Gemini should output valid JSON
#     return schema

# # -----------------------------
# # 5. Price prediction
# # -----------------------------
# def predict_price(schema, feature_columns):
#     df = pd.DataFrame([schema])
#     df_encoded = pd.get_dummies(df.drop(['title', 'description'], axis=1))
#     for col in feature_columns:
#         if col not in df_encoded.columns:
#             df_encoded[col] = 0
#     df_encoded = df_encoded[feature_columns]
#     return model.predict(df_encoded)[0]

# # -----------------------------
# # 6. FastAPI endpoint
# # -----------------------------
# @app.post("/generate_listing", response_model=ProductOutput)
# async def generate_listing(file: UploadFile = File(...)):
#     image_bytes = await file.read()
#     raw_tags = call_gemini_vision(image_bytes)
#     schema = map_tags_to_schema(raw_tags)
#     predicted_price = predict_price(schema, feature_columns)
#     return ProductOutput(
#         title=schema["title"],
#         description=schema["description"],
#         predicted_price=round(predicted_price, 2)
#     )

# -----------------------------
# Run: uvicorn main:app --reload
# -----------------------------

## app.py
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import uuid, os
from services.image_ai import enhance_image
from services.vision_text import caption_and_tags
from services.llm_text import generate_listing_from_caption
from services.supabase_service import upload_to_supabase_and_record

UPLOAD_DIR = "static/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

@app.post("/upload-image")
async def upload_image(image: UploadFile = File(...)):
    # Save original
    file_id = str(uuid.uuid4())
    orig_path = os.path.join(UPLOAD_DIR, f"{file_id}_orig.jpg")
    with open(orig_path, "wb") as f:
        f.write(await image.read())

    # 1) Enhance image (Real-ESRGAN/GFPGAN wrapper)
    try:
        enhanced_path = enhance_image(orig_path)
    except Exception as e:
        # fallback: use original if enhancement fails
        enhanced_path = orig_path

    # 2) Run vision/caption model
    caption, tags = caption_and_tags(enhanced_path)

    # 3) Generate title, story, price
    listing = generate_listing_from_caption(caption, tags)

    # 4) Upload to Supabase storage & create DB record (optional)
    # This function should return public URL for image and DB id
    supa_res = upload_to_supabase_and_record(enhanced_path, listing)

    # combine results
    response = {
        "enhanced_image_url": supa_res.get("public_url", enhanced_path),
        "title": listing.get("title"),
        "story": listing.get("story"),
        "tags": listing.get("tags"),
        "suggested_price": listing.get("suggested_price"),
        "price_reason": listing.get("price_reason"),
        "db_id": supa_res.get("product_id")
    }
    return JSONResponse(response)
