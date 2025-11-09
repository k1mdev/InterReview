from dotenv import load_dotenv
from pathlib import Path
import os
import json
from google import genai

load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")

api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
if not api_key:
    raise SystemExit("Set GOOGLE_API_KEY or GEMINI_API_KEY in your environment or backend/.env")
client = genai.Client(api_key=api_key)

# Inputs
scenario = (
    "You are evaluating a candidate's spoken response in a mock interview. "
    "Give feedback on the relevance of the candidate's response to the question."
    "Provide only the requested JSON; no extra commentary."
)
question = "Describe a challenging bug you fixed and how you approached it."

# Upload audio
audio_path = "/Users/jimmyjiang/Documents/Projects/InterReview/backend/test.mp3"
myfile = client.files.upload(file=audio_path)

response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[
        "Transcribe the audio file provided.",
        f"Question to answer using the transcription:\n{question}",
        "Return ONLY valid JSON with keys: transcription, question, feedback.",
        myfile,
    ],
    config={
        "system_instruction": scenario,
        "response_mime_type": "application/json",
        "temperature": 0.2,
    },
)

raw = response.text.strip()
print("Raw model output:\n", raw)

# Parse and print
try:
    data = json.loads(raw)
    print("\nParsed:")
    print("Question:", data.get("question"))
    print("Transcription:", data.get("transcription"))
    print("Feedback:", data.get("feedback"))
except Exception as e:
    print("\nJSON parse failed:", e)
    print("Fallback:\n", raw)