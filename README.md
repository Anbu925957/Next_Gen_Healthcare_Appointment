# NextGen Healthcare Appointment System

A comprehensive healthcare appointment management platform with an AI-powered virtual doctor assistant chatbot built with Flask and Google Gemini API.

## Overview

NextGen Healthcare is a modern web application that connects patients with healthcare services through an intuitive interface and an intelligent chatbot powered by Google's Gemini AI. The system provides appointment scheduling, patient dashboard management, and instant virtual consultation capabilities.

## Features

- **Virtual Doctor Chatbot** - AI-powered assistant using Google Gemini for preliminary health consultations
- **Patient Dashboard** - Complete patient profile and appointment management
- **Doctor Portal** - Doctor interface for managing appointments and patient information
- **User Authentication** - Secure login system for patients and doctors
- **Responsive Design** - Modern UI built with HTML, CSS, and JavaScript
- **RESTful API** - Backend API for all client interactions

## Tech Stack

### Backend
- **Framework**: Flask (Python)
- **AI Integration**: Google Gemini API (genai library)
- **Environment Management**: python-dotenv

### Frontend
- **Languages**: HTML5, CSS3, JavaScript
- **Structure**: Multi-page application with dedicated sections for patients and doctors

### Database/Storage
- Environment variables for API key management

## Project Structure

```
Next_Gen_Healthcare_Appointment/
├── app.py                      # Flask application entry point
├── genai_chatbot.py           # Google Gemini chatbot integration
├── .env                        # Environment variables (not committed)
├── .gitignore                  # Git ignore file
├── requirements.txt            # Python dependencies
├── templates/
│   └── chatbot.html           # Chatbot interface template
├── anbu-main/
│   ├── index.html             # Login page
│   ├── assets/
│   │   ├── css/
│   │   │   └── style.css      # Main stylesheet
│   │   └── js/
│   │       ├── auth.js        # Authentication logic
│   │       ├── chatbot.js     # Chatbot client logic
│   │       ├── data.js        # Data management
│   │       └── support.js     # Support functions
│   ├── doctor/
│   │   ├── doctor.html        # Doctor dashboard
│   │   └── doctor.js          # Doctor interface logic
│   └── patient/
│       ├── patient.html       # Patient dashboard
│       └── patient.js         # Patient interface logic
└── __pycache__/               # Python cache (auto-generated)
```

## Installation

### Prerequisites
- Python 3.8 or higher
- Google Gemini API key
- Modern web browser

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anbu925957/Next_Gen_Healthcare_Appointment.git
   cd Next_Gen_Healthcare_Appointment
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   # or
   source .venv/bin/activate  # macOS/Linux
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   GEMINI_API_KEY=your_google_gemini_api_key_here
   FLASK_ENV=development
   ```

5. **Run the application**
   ```bash
   python app.py
   ```

6. **Access the application**
   Open your browser and navigate to:
   - Main application: `http://localhost:5000/`
   - Patient dashboard: `http://localhost:5000/patient`

## API Endpoints

### POST `/chat`
Send a message to the virtual doctor chatbot.

**Request:**
```json
{
  "message": "I have a headache"
}
```

**Response:**
```json
{
  "reply": "I understand you're experiencing a headache. Can you describe the severity and duration of your headache?"
}
```

### GET `/`
Serves the main chatbot interface.

### GET `/patient`
Serves the patient dashboard.

## How It Works

1. **User Authentication** - Patients and doctors log in through the secure authentication system
2. **Chatbot Interaction** - Users can send messages to the virtual doctor chatbot
3. **AI Response** - Google Gemini API processes the query and provides medical guidance
4. **Disclaimer** - The chatbot strictly follows rules to never diagnose or prescribe, always recommending consultation with real doctors
5. **Dashboard Management** - Patients can view appointments and manage their profiles

## Chatbot Guidelines

The virtual doctor assistant operates under strict guidelines:
- Responds in 3-5 short sentences
- Maintains a calm and professional tone
- Asks at most ONE follow-up question
- Does NOT provide diagnoses
- Does NOT prescribe medicines
- Always recommends consulting a real doctor

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for chatbot functionality | Yes |
| `FLASK_ENV` | Flask environment (development/production) | No |

## Getting Your Google Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Click "Get API key"
3. Create a new API key in Google Cloud Console
4. Copy the key and paste it in your `.env` file

## Development

To run in development mode with auto-reload:
```bash
python app.py
```

The Flask development server will start on `http://localhost:5000` with debug mode enabled.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## License

This project is open source and available under the MIT License.

## Authors

- **Anbu925957** - Project maintainer

## Support

For issues, questions, or suggestions, please open an issue on the GitHub repository.

## Disclaimer

This application provides a virtual health consultation tool for informational purposes only. It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult with qualified healthcare professionals for medical concerns.
