# AI-First CRM HCP Module – Log Interaction Screen

This project is an AI-first CRM module designed for field representatives in the life sciences domain. It focuses on the Healthcare Professional (HCP) interaction logging workflow.

The system allows users to log HCP interactions through a conversational AI assistant. The LangGraph agent uses Groq LLM to understand the user’s message, detect intent, and automatically populate or update the structured CRM form.

## Features

- AI-first Log Interaction Screen
- Conversational chat-based interaction logging
- Auto-filled structured CRM form
- Chat-based edit interaction flow
- LLM-driven summarization
- LLM-driven follow-up action extraction
- HCP interaction history retrieval
- PostgreSQL database storage
- React UI with Redux state management
- FastAPI backend
- LangGraph AI agent orchestration
- Google Inter font UI styling

## Tech Stack

### Frontend
- React
- Redux Toolkit
- Axios
- Google Inter Font

### Backend
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

### AI
- LangGraph
- Groq LLM
- Model used: `llama-3.3-70b-versatile`

> Note: The assignment mentioned `gemma2-9b-it`, but Groq has decommissioned that model. Therefore, `llama-3.3-70b-versatile` was used as the supported Groq model.

## LangGraph Tools

The LangGraph agent supports five LLM-driven tools:

1. **Log Interaction**
   - Extracts HCP name, specialty, interaction type, products discussed, sentiment, materials shared, samples, outcomes, and follow-up details from natural language.

2. **Edit Interaction**
   - Allows the user to correct details through chat.
   - Example: “Actually the doctor name is Dr John, not Dr Smith.”

3. **Summarize Interaction**
   - Generates a professional summary of the current HCP interaction.

4. **Extract Action Items**
   - Identifies next steps and follow-up actions from the interaction context.

5. **Fetch HCP History**
   - Retrieves previous interactions from PostgreSQL and summarizes them for the field representative.

## Project Structure

```text
aivoa-hcp-crm/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── tools.py
│   ├── langgraph_agent.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── store/
│   │   │   ├── store.js
│   │   │   └── interactionSlice.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── index.html
│
└── README.md

Backend Setup

Go to backend folder:

cd backend
Create and activate virtual environment:

python -m venv env
env\Scripts\activate

Install dependencies:

pip install -r requirements.txt

Create .env file:

GROQ_API_KEY=your_groq_api_key_here
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/hcp_crm

Run backend:

uvicorn main:app --reload

Backend runs at:

http://127.0.0.1:8000

Swagger docs:

http://127.0.0.1:8000/docs
Frontend Setup

Go to frontend folder:

cd frontend

Install packages:

npm install

Run frontend:

npm run dev

Frontend runs at:

http://localhost:5173
Sample Chat Inputs
Log Interaction
Today I met Dr Smith, a cardiologist. We discussed Product X efficacy. The sentiment was positive and I shared brochures.
Edit Interaction
Actually the doctor name is Dr John, not Dr Smith.
Summarize Interaction
Can you summarize this interaction?
Extract Follow-up Actions
What are the follow-up actions?
Fetch HCP History
Show previous interaction history for Dr John.
How It Works
User enters a natural language message in the AI Assistant.
FastAPI sends the message and current form state to the LangGraph agent.
LangGraph routes the message to the correct LLM-driven tool.
Groq LLM extracts, edits, summarizes, or generates actions.
React + Redux updates the form automatically.
User saves the interaction to PostgreSQL.
Submission Notes

This project demonstrates an AI-first CRM workflow where the user does not manually fill the form. Instead, the AI assistant understands the conversation and updates the structured CRM form automatically.