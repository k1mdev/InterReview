from dotenv import load_dotenv
from pathlib import Path
import os
from google import genai

load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")

api_key = os.getenv("GEMINI_API_KEY")

client = genai.Client()
myfile = client.files.upload(file='/Users/jimmyjiang/Documents/Projects/InterReview/backend/test.mp3')
prompt = 'Generate a transcript of the speech.'

response = client.models.generate_content(
  model='gemini-2.5-flash',
  contents=[prompt, myfile]
)

print(response.text)



