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

import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template_string
from google import genai
from google.genai import types
from flask_cors import CORS

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Initialize Gemini client
client = genai.Client(api_key=GEMINI_API_KEY)


@app.route("/", methods=["GET"])
def home():
    return render_template_string("""
    <!doctype html>
    <html>
    <head><title>Upload Image</title></head>
    <body>
        <h2>Upload an Image</h2>
        <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="image" accept="image/*" required>
            <button type="submit">Upload</button>
        </form>
    </body>
    </html>
    """)


@app.route("/upload", methods=["POST"])
def upload_image():
    if "image" not in request.files:
        return jsonify({"error": "No image file uploaded"}), 400

    image_file = request.files["image"]
    image_bytes = image_file.read()

    image_part = types.Part.from_bytes(
        data=image_bytes, mime_type=image_file.content_type
    )

    try:
        # --- Generate Title & Description ---
        caption_response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                "Look at this product image and generate ONE suitable product title (5 words max) "
                "and ONE product description (2-3 sentences). "
                "Return the title on the first line, and the description on the second line. "
                "Do not include extra text or explanations.",
                image_part,
            ],
        )

        lines = caption_response.text.strip().split("\n", 1)
        title = lines[0].strip() if len(lines) > 0 else "Untitled Product"
        description = lines[1].strip() if len(lines) > 1 else "No description available."

        # --- Generate Tags ---
        tag_response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                "Look at this product image and generate 3 to 5 short, lowercase, single-word tags "
                "relevant to Indian handicraft/artistry. "
                "Return them as a comma-separated list, nothing else.",
                image_part,
            ],
        )
        tags = [t.strip() for t in tag_response.text.strip().split(",") if t.strip()]

        # --- Predict Price using Gemini ---
        price_response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=[
                f"This is a handicraft product.\n"
                f"Title: {title}\n"
                f"Description: {description}\n"
                "Suggest a reasonable selling price in INR (just the number, no currency symbols or words)."
            ],
        )

        try:
            predicted_price = float(price_response.text.strip().split()[0])
            predicted_price = round(predicted_price, 2)
        except:
            predicted_price = "Unavailable"

        return jsonify({
            "title": title,
            "description": description,
            "tags": tags,
            "price": predicted_price
        })

    except Exception as e:
        return jsonify({
            "error": "AI service unavailable, please try again later.",
            "details": str(e)
        }), 503


if __name__ == "__main__":
    app.run(debug=True, port=5000)