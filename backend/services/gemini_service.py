from dotenv import load_dotenv
import os

# Load variables from .env
load_dotenv()

# Access the Gemini key
api_key = os.getenv("GEMINI_API_KEY")

print("Gemini key loaded:", bool(api_key))  # Optional sanity check
