from google import genai
import os

# Client reads GEMINI_API_KEY automatically from environment
client = genai.Client()

SYSTEM_PROMPT = """
You are a virtual doctor assistant for a healthcare appointment system.

Rules:
- Respond in 3–5 short sentences
- Be calm and professional
- Ask at most ONE follow-up question
- DO NOT diagnose
- DO NOT prescribe medicines
- Always suggest consulting a real doctor
"""

def get_doctor_response(user_message: str) -> str:
    prompt = f"""
{SYSTEM_PROMPT}

Patient: {user_message}
Assistant:
"""

    response = client.models.generate_content(
        model="gemini-3-flash-preview",
        contents=prompt
    )

    return response.text.strip()
