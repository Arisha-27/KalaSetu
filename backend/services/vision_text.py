from PIL import Image
import torch

# Use lightweight models for dev if GPU not available
from transformers import Blip2Processor, Blip2ForConditionalGeneration

device = "cuda" if torch.cuda.is_available() else "cpu"

# Choose smaller BLIP model for CPU/dev
MODEL_NAME = "Salesforce/blip2-opt-2.7b"  # replace with smaller if necessary

# Lazy load
_processor = None
_blip_model = None

def _load_blip():
    global _processor, _blip_model
    if _processor is None:
        _processor = Blip2Processor.from_pretrained(MODEL_NAME)
        _blip_model = Blip2ForConditionalGeneration.from_pretrained(MODEL_NAME).to(device)
    return _processor, _blip_model

def caption_and_tags(image_path: str):
    """
    Returns (caption_text, tags_list)
    """
    try:
        processor, model = _load_blip()
        img = Image.open(image_path).convert("RGB")
        inputs = processor(images=img, text="Describe this product in one sentence and list 5 tags.", return_tensors="pt").to(device)
        outputs = model.generate(**inputs, max_new_tokens=80)
        caption = processor.decode(outputs[0], skip_special_tokens=True)
        # crude tag extraction: split on commas if present or return words
        tags = [t.strip() for t in caption.split(",")[:6] if len(t.strip())>0]
        # If caption too long, keep first sentence
        caption = caption.split(".")[0].strip()
        if not tags:
            tags = caption.split()[:6]
        return caption, tags
    except Exception as e:
        print("BLIP-2 failed:", e)
        # fallback
        return "Handcrafted product", ["handmade", "craft", "unique"]
