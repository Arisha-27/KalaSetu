from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import torch
import json

device = "cuda" if torch.cuda.is_available() else "cpu"

# Use a smaller Flan-T5 for dev on CPU
MODEL_NAME = "google/flan-t5-small"  # swap to flan-t5-large on GPU for better quality

_tokenizer = None
_llm = None

def _load_llm():
    global _tokenizer, _llm
    if _tokenizer is None:
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        _llm = AutoModelForSeq2SeqLM.from_pretrained(MODEL_NAME).to(device)
    return _tokenizer, _llm

def generate_listing_from_caption(caption: str, tags):
    """
    Returns a dict with keys: title, story, tags(list), suggested_price, price_reason
    This uses a prompt template for the LLM.
    """
    tokenizer, model = _load_llm()
    prompt = f"""
You are a helpful marketplace assistant for local artisans.
Given this short caption and tags, produce a JSON with:
title, story (3 lines), tags (list of 6), suggested_price (integer INR), price_reason (one line).
Caption: "{caption}"
Tags: {tags}
Market note: use a reasonable price for handcrafted items of this type in India.
Return ONLY valid JSON.
"""
    inputs = tokenizer(prompt, return_tensors="pt").to(device)
    outputs = model.generate(**inputs, max_new_tokens=200)
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)

    # Try to safely parse JSON out of the model output
    try:
        # sometimes model returns text with explanation; try to find JSON inside
        start = text.find("{")
        end = text.rfind("}") + 1
        if start != -1 and end != -1:
            payload = json.loads(text[start:end])
        else:
            raise ValueError("No JSON found")
    except Exception as e:
        print("LLM parse failed, using fallback. LLM raw:", text)
        # fallback simple structure
        payload = {
            "title": caption.title(),
            "story": f"{caption}. Handcrafted with care by local artisans.",
            "tags": tags[:6],
            "suggested_price": 800,
            "price_reason": "Estimated from similar handcrafted items."
        }
    return payload

# Optional: Vertex AI (Gemini) example (requires google-cloud-aiplatform and credentials)
# def generate_with_gemini(caption, tags):
#     from google.cloud import aiplatform
#     aiplatform.init(project="YOUR_PROJECT", location="us-central1")
#     model = aiplatform.TextGenerationModel.from_pretrained("gemini-pro")
#     prompt = "..."
#     resp = model.predict(prompt)
#     return resp.text
