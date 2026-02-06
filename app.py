from flask import Flask, render_template, request, jsonify
from genai_chatbot import get_doctor_response
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)

# Chatbot page
@app.route("/")
def chatbot():
    return render_template("chatbot.html")

# Patient dashboard
@app.route("/patient")
def patient():
    return render_template("patient.html")

# Chat API
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json()

    if not data or "message" not in data:
        return jsonify({"reply": "No message received"}), 400

    user_message = data["message"]

    try:
        reply = get_doctor_response(user_message)
        return jsonify({"reply": reply})
    except Exception as e:
        print("ERROR:", e)
        return jsonify({"reply": "Assistant unavailable"}), 500


if __name__ == "__main__":
    app.run(debug=True)
