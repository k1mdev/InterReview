import io
from dotenv import load_dotenv
# from pathlib import Path
import os
import json
from google import genai


def analyze_interview(question, audio_file):
    load_dotenv()
    # load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / ".env")

    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise SystemExit("Set GOOGLE_API_KEY or GEMINI_API_KEY in your environment or backend/.env")
    client = genai.Client(api_key=api_key)

    # Read it into memory
    audio_bytes = audio_file.read()
    mime_type = audio_file.mimetype or 'audio/wav'

    # Upload directly to Gemini's file API from memory
    upload = client.files.upload(
        file=io.BytesIO(audio_bytes),
        config={
            "mime_type": mime_type,
            "displayName": audio_file.filename
        }
    )

    scenario = (
        "You are an expert AI Interview Performance Coach. Your task is to perform a comprehensive, "
        "one-pass analysis of the user's audio response to the interview question. "
        "You must simultaneously transcribe the speech, analyze the content, and evaluate the delivery (tone, pace, clarity, confidence, and filler words). "
        "You MUST use the transcribed speech's timestamps to pinpoint specific feedback moments. "
        "Adhere strictly to the provided JSON Schema."
    )

    contents = [
        # Refined main instruction part
        {"role": "user", "parts": [
            {"text": f"Interview Question:\n{question}"},
            {"text": (
                "Analyze the audio against the question above. "
                "1. Provide a full **transcript**."
                "2. Generate **overall_feedback** (100-150 words)."
                "3. Generate **timestamped_feedback** (a list of fine-tuned, precise, timestamped observations) for filler words, tone, and content."
                "Use MM:SS or MM:SS.ms format for timestamps, derived from your transcription."
            )},
            
            upload
        ]}
    ]

    # question = "Describe a challenging bug you fixed and how you approached it."

    # Upload audio
    # audio_path = "/Users/jimmyjiang/Documents/Projects/InterReview/backend/test.mp3"
    # myfile = client.files.upload(file=audio_path)

    # response = client.models.generate_content(
    #     model="gemini-2.5-flash",
    #     contents=[
    #         "Transcribe the audio file provided.",
    #         f"Question to answer using the transcription:\n{question}",
    #         "Return ONLY valid JSON with keys: transcription, question, feedback.",
    #         myfile,
    #     ],
    #     config={
    #         "system_instruction": scenario,
    #         "response_mime_type": "application/json",
    #         "temperature": 0.2,
    #     },
    # )
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config={
            "system_instruction": scenario,
            "response_mime_type": "application/json",
            "response_schema": response_schema,
            "temperature": 0.2,
        },
    )

    response_schema = {
        "type": "object",
        "properties": {
            "transcript": {
                "type": "string",
                "description": "The complete, clean, and accurate transcription of the user's speech."
            },
            "overall_feedback": {
                "type": "string",
                "description": "A 100-150 word summary of performance, highlighting key strengths and major areas for improvement."
            },
            "timestamped_feedback": {
                "type": "array",
                "description": "A list of precise, timestamped observations for display on a seek bar.",
                "items": {
                    "type": "object",
                    "properties": {
                        "timestamp_start": {
                            "type": "string",
                            "description": "The start time of the event (MM:SS or MM:SS.ms format)."
                        },
                        "timestamp_end": {
                            "type": "string",
                            "description": "The end time of the event (MM:SS or MM:SS.ms format)."
                        },
                        "type": {
                            "type": "string",
                            "enum": [
                                "POSITIVE_TONE",
                                "LOW_CONFIDENCE",
                                "FILLER_WORD",
                                "RUSHED_PACE",
                                "VAGUE_CONTENT",
                                "STRONG_EXAMPLE",
                                "OTHER"
                            ],
                            "description": "A category for the feedback event."
                        },
                        "comment": {
                            "type": "string",
                            "description": "A brief, actionable comment (e.g., 'Identified filler: um.', 'Good pace control.', 'Vague answer.')."
                        }
                    },
                    "required": ["timestamp_start", "timestamp_end", "type", "comment"]
                }
            }
        },
        "required": ["transcript", "overall_feedback", "timestamped_feedback"]
    }

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



