import os, json, re
from dotenv import load_dotenv
from langchain_groq import ChatGroq

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    groq_api_key=os.getenv("GROQ_API_KEY"),
    temperature=0.2,
)

def clean_json(text):
    try:
        match = re.search(r"\{.*\}", text, re.DOTALL)
        if match:
            return json.loads(match.group())
    except Exception:
        pass
    return {
        "intent": "log_interaction",
        "data": {},
        "reply": "I processed the request."
    }

def llm_router_tool(message, current_form):
    prompt = f"""
You are an AI-first CRM assistant for Healthcare Professional interaction logging.

Choose exactly one intent:
1. log_interaction
2. edit_interaction
3. summarize_interaction
4. extract_action_items
5. fetch_hcp_history

Use the user's message and current form.

Current form:
{current_form}

User message:
{message}

Return ONLY valid JSON:
{{
  "intent": "",
  "data": {{
    "hcp_name": "",
    "specialty": "",
    "interaction_type": "",
    "attendees": "",
    "products_discussed": "",
    "materials_shared": "",
    "samples_distributed": "",
    "sentiment": "",
    "outcomes": "",
    "follow_up_date": "",
    "notes": ""
  }},
  "reply": ""
}}
"""
    return clean_json(llm.invoke(prompt).content)

def summarize_interaction_tool(current_form):
    prompt = f"""
Summarize this HCP interaction professionally in 2-3 lines.

Interaction:
{current_form}
"""
    return llm.invoke(prompt).content

def extract_action_items_tool(current_form):
    prompt = f"""
Extract clear follow-up actions from this HCP interaction.

Interaction:
{current_form}

Return concise action items.
"""
    return llm.invoke(prompt).content

def format_hcp_history_tool(hcp_name, records):
    prompt = f"""
You are a CRM assistant. Summarize the previous interaction history for {hcp_name}.

Records:
{records}

Return a short useful summary for a sales representative.
"""
    return llm.invoke(prompt).content