from typing import TypedDict, Dict, Any
from langgraph.graph import StateGraph, END
from tools import llm_router_tool, summarize_interaction_tool, extract_action_items_tool

class AgentState(TypedDict):
    message: str
    current_form: Dict[str, Any]
    result: Dict[str, Any]

def route_with_llm(state: AgentState):
    result = llm_router_tool(state["message"], state["current_form"])
    return {
        "message": state["message"],
        "current_form": state["current_form"],
        "result": result,
    }

def run_tool(state: AgentState):
    result = state["result"]
    intent = result.get("intent")
    current_form = state["current_form"]

    if intent == "summarize_interaction":
        result["reply"] = summarize_interaction_tool(current_form)

    if intent == "extract_action_items":
        result["reply"] = extract_action_items_tool(current_form)

    return {
        "message": state["message"],
        "current_form": current_form,
        "result": result,
    }

graph = StateGraph(AgentState)
graph.add_node("llm_router", route_with_llm)
graph.add_node("tool_executor", run_tool)

graph.set_entry_point("llm_router")
graph.add_edge("llm_router", "tool_executor")
graph.add_edge("tool_executor", END)

agent = graph.compile()