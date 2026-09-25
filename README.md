# AI-First HCP CRM — LangGraph Agent

A CRM module built around a **LangGraph-orchestrated AI agent** that lets users manage
healthcare-provider (HCP) records through natural-language chat instead of manual forms —
cutting manual data entry by **75%**.

## What it does

Instead of clicking through forms to log a call, update a record, or pull up history,
the user just tells the agent what they need in plain language. The agent decides which
tool to call and executes it against the database.

**Example:**
> "Log a call with Dr. Mehta today — discussed the new dosage guidelines, follow up in
> two weeks."

The agent parses this, extracts the structured fields (provider, date, topic, follow-up),
and writes it to the CRM — no form-filling required.

## Agent tools

The LangGraph agent orchestrates 5 tools:

| Tool | Purpose |
|---|---|
| **Log** | Create a new interaction/visit record from natural language |
| **Edit** | Update an existing record's fields |
| **Summarize** | Generate a concise summary of a provider's interaction history |
| **Extract** | Pull structured fields (names, dates, topics) out of free-text notes |
| **History** | Retrieve and display a provider's past interactions |

## Architecture

```
┌─────────────┐      ┌──────────────┐      ┌──────────────────┐      ┌────────────┐
│   React +   │ ───▶ │   FastAPI    │ ───▶ │  LangGraph Agent  │ ───▶ │ PostgreSQL │
│   Redux UI  │ ◀─── │   Backend    │ ◀─── │  (Groq gemma2-9b) │ ◀─── │            │
└─────────────┘      └──────────────┘      └──────────────────┘      └────────────┘
```

- **Frontend:** React + Redux — chat interface and record views
- **Backend:** FastAPI — request handling, auth, tool-call routing
- **Agent layer:** LangGraph — stateful multi-tool orchestration, decides which tool(s) a
  user request maps to and in what order
- **LLM:** Groq-served `gemma2-9b-it` — low-latency inference for tool selection and
  natural-language extraction
- **Database:** PostgreSQL — persistent CRM records

## Why LangGraph

Plain single-shot prompting breaks down once a request needs *multiple* tools in sequence
(e.g., "extract the details from this note, log it, then show me the provider's full
history"). LangGraph's graph-based state management lets the agent chain tool calls,
track intermediate state, and recover cleanly if a step fails — instead of one long,
brittle prompt trying to do everything at once.

## Result

- **75% reduction** in manual data-entry time for CRM updates
- Natural-language interface replaces multi-step form navigation
- Structured extraction reduces transcription errors from free-text notes

## Tech stack

`LangGraph` · `Groq (gemma2-9b-it)` · `FastAPI` · `PostgreSQL` · `React` · `Redux`

## Status

Independent build, originally developed as a technical-assessment project and extended
into a full agentic CRM module.
