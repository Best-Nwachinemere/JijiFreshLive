# JijiFresh Agent API

A Flask-based API that powers the JijiFresh AI Assistant using OpenRouter.

## Setup

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env and add your OpenRouter API key
```

3. **Get OpenRouter API Key:**
   - Go to https://openrouter.ai/
   - Sign up for a free account
   - Get your API key from the dashboard
   - Add it to your `.env` file

4. **Run the server:**
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Endpoints

- `POST /chat` - Send messages to the AI agent
- `GET /health` - Health check
- `GET /` - API information

## Usage

Send a POST request to `/chat` with:
```json
{
  "message": "I want to sell my phone",
  "context": {
    "userRole": "seller",
    "currentPage": "/",
    "isLoggedIn": true
  }
}
```

The agent will respond with helpful guidance based on the user's intent and context.

## Features

- OpenRouter integration for AI responses
- Context-aware responses based on user role and current page
- File upload support for images/videos
- Fallback responses when API is unavailable
- Nigerian Pidgin English support
- JijiFresh-specific knowledge and guidance