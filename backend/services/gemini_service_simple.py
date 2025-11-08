from dotenv import load_dotenv
from pathlib import Path
import os
import json
from typing import Any
from google import genai

# Load environment variables
load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")

api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
if not api_key:
    raise SystemExit("Set GOOGLE_API_KEY or GEMINI_API_KEY in your environment or backend/.env")

client = genai.Client(api_key=api_key)

def evaluate_response(question: str, audio_source: Any):
    """
    Transcribes and evaluates a spoken response to a given question using Gemini.
    
    Args:
        question (str): The interview question the candidate is responding to.
        audio_source (str | file-like): Path to the candidate's audio file OR a file-like object
            (e.g., Flask's FileStorage) supporting .read() (optionally .seek()).
    
    Returns:
        dict: A dictionary with keys 'question', 'transcription', and 'feedback'.
    """
    scenario = (
        "You are evaluating a candidate's spoken response in a mock interview. "
        "Give feedback on the relevance of the candidate's response to the question. "
        "Provide only the requested JSON; no extra commentary."
    )

    try:
        # Upload audio
        myfile = client.files.upload(file=audio_source)

        # Generate response
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

        # Parse response
        raw = response.text.strip()
        try:
            data = json.loads(raw)
            return data
        except json.JSONDecodeError:
            print("Warning: Model did not return valid JSON. Returning raw text.")
            return {"question": question, "raw_output": raw}

    except Exception as e:
        return {"error": f"Gemini evaluation failed: {e}"}

# Example usage
if __name__ == "__main__":
    result = evaluate_response(
        question="Describe a challenging bug you fixed and how you approached it.",
        audio_source="/Users/jimmyjiang/Documents/Projects/InterReview/backend/test.mp3"
    )
    print(json.dumps(result, indent=2))
