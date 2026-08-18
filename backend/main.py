from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from google import genai
import os
import json
# Load environment variables from .env
load_dotenv()

    
# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

# Create Gemini client
client = genai.Client(api_key=api_key)

app = FastAPI(title="AI Bug Explainer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class BugRequest(BaseModel):
    language: str
    code: str
    error: str


@app.get("/")
def home():
    return {
        "message": "AI Bug Explainer API is running!"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.post("/explain")
def explain_bug(bug: BugRequest):

    prompt = f"""
You are an expert programming tutor and debugging assistant.

Analyze this bug.

Language:
{bug.language}

Code:
{bug.code}

Error:
{bug.error}

Return ONLY valid JSON.
Do not use markdown code fences.
Do not add any text before or after the JSON.

Use exactly this structure:

{{
  "problem": "Explain what went wrong",
  "cause": "Explain the root cause",
  "solution": "Explain how to fix it",
  "fixed_code": "Complete corrected code",
  "prevention": "How to avoid this mistake",
  "time_complexity": "Time complexity",
  "space_complexity": "Space complexity"
}}
"""

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=prompt
    )

    try:
        result = json.loads(response.text)

        return result

    except json.JSONDecodeError:
        return {
            "problem": "AI returned an invalid response.",
            "cause": response.text,
            "solution": "",
            "fixed_code": "",
            "prevention": "",
            "time_complexity": "",
            "space_complexity": ""
        }