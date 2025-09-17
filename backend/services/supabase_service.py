import os
from supabase import create_client, Client
from uuid import uuid4

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if SUPABASE_URL and SUPABASE_KEY:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
else:
    supabase = None

def upload_to_supabase_and_record(image_path, listing):
    """
    Upload file to Supabase storage and create DB record.
    Returns dict with public_url and product_id.
    """
    if supabase is None:
        # If Supabase not configured, return local path
        return {"public_url": f"/{image_path}", "product_id": None}

    bucket = "products"
    remote_name = f"{uuid4().hex}_{os.path.basename(image_path)}"
    with open(image_path, "rb") as f:
        res = supabase.storage.from_(bucket).upload(remote_name, f)
    # make public
    public_url = supabase.storage.from_(bucket).get_public_url(remote_name).get("publicURL")

    # Insert DB record
    product = {
        "title": listing.get("title"),
        "description": listing.get("story"),
        "tags": listing.get("tags"),
        "price": listing.get("suggested_price"),
        "image_url": public_url
    }
    db = supabase.table("products").insert(product).execute()
    product_id = None
    try:
        product_id = db.data[0]["id"]
    except Exception:
        product_id = None

    return {"public_url": public_url, "product_id": product_id}
