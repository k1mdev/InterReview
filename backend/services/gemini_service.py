from dotenv import load_dotenv
from pathlib import Path
import os
import json
from typing import Any, Dict
from google import genai

load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")

api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=api_key)

FEEDBACK_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "transcription": {
            "type": "STRING",
            "description": "The complete, continuous text transcription of the audio response."
        },
        "feedback": {
            "type": "OBJECT",
            "properties": {
                "overall_feedback": {
                    "type": "STRING",
                    "description": "A summary paragraph providing an assessment, key strengths, and areas for improvement."
                },
                "timestamped_feedback": {
                    "type": "ARRAY",
                    "description": "A detailed array of specific feedback points linked to audio time segments.",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "start_time_ms": {
                                "type": "INTEGER",
                                "description": "The start time of the segment in milliseconds (for seek bar markers)."
                            },
                            "end_time_ms": {
                                "type": "INTEGER",
                                "description": "The end time of the segment in milliseconds (for highlighting the duration)."
                            },
                            "category": {
                                "type": "STRING",
                                "description": "The type of feedback. Must be one of: 'Filler Word', 'Clarity', 'Tone/Pace', 'Word Choice', 'Accuracy/Relevance', 'Excellent Point', 'Suggestion'."
                            },
                            "detail": {
                                "type": "STRING",
                                "description": "The specific feedback or advice for this segment."
                            },
                            "transcript_segment": {
                                "type": "STRING",
                                "description": "The exact transcript text that the feedback relates to (e.g., 'I, uh, think that')."
                            }
                        },
                        "required": ["start_time_ms", "end_time_ms", "category", "detail", "transcript_segment"]
                    }
                }
            },
            "required": ["overall_feedback", "timestamped_feedback"]
        }
    },
    "required": ["transcription", "feedback"]
}

def evaluate_response(question: str, audio_source: Any) -> Dict[str, Any]:    
    system_instruction = (
        "You are a professional interview coach. Analyze the user's audio response against the "
        "provided interview question. Simultaneously provide the full transcript of the audio "
        "and the detailed feedback analysis. Give feedback on accuracy, filler words, tone, "
        "word choice, clarity, and relevance. All timing data MUST be in milliseconds (ms). "
        "The entire output MUST STRICTLY adhere to the provided JSON schema. Use the second "
        "person point of view (e.g. 'you') to address the candidate. For the timestamped "
        "feedback, you should frequenty produce entries in order to give fine-tuned advice."
    )

    try:
        myfile = client.files.upload(file=audio_source)

        response = client.models.generate_content(
            model="gemini-2.5-flash-preview-09-2025",
            contents=[
                f"Interview Question: {question}",
                "Analyze the following audio recording and generate a full transcription and structured feedback.",
                myfile,
            ],
            config={
                "system_instruction": system_instruction,
                "response_mime_type": "application/json",
                "response_schema": FEEDBACK_SCHEMA,
                "temperature": 0.2,
            },
        )

        raw = response.text.strip()
        try:
            data = json.loads(raw)
            return data
        except json.JSONDecodeError:
            return {"error": "Model did not return valid JSON.", "raw_output": raw}

    except Exception as e:
        return {"error": f"Gemini evaluation failed: {e}"}