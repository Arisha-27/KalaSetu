import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase = create_client(url, service_key)

# Example: insert product
def insert_product(data):
    response = supabase.table("ai_generations_log").insert(data).execute()
    return response

# Example: fetch products by artisan_id
def fetch_products(artisan_id):
    response = supabase.table("ai_generations_log").select("*").eq("artisan_id", artisan_id).execute()
    return response.data
