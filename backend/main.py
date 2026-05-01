from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import Base, engine, get_db
from models import Interaction
from langgraph_agent import agent
from tools import format_hcp_history_tool

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI First CRM HCP Module")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
def chat(data: dict, db: Session = Depends(get_db)):
    message = data.get("message", "")
    current_form = data.get("current_form", {})

    result = agent.invoke({
        "message": message,
        "current_form": current_form,
        "result": {}
    })

    output = result["result"]
    intent = output.get("intent")

    if intent == "fetch_hcp_history":
        hcp_name = output.get("data", {}).get("hcp_name") or current_form.get("hcp_name", "")
        records = db.query(Interaction).filter(
            Interaction.hcp_name.ilike(f"%{hcp_name}%")
        ).all()

        records_data = [
            {
                "hcp_name": r.hcp_name,
                "specialty": r.specialty,
                "interaction_type": r.interaction_type,
                "products_discussed": r.products_discussed,
                "notes": r.notes,
                "follow_up_date": r.follow_up_date,
            }
            for r in records
        ]

        output["reply"] = format_hcp_history_tool(hcp_name, records_data)

    return output

@app.post("/save")
def save(data: dict, db: Session = Depends(get_db)):
    interaction = Interaction(
        hcp_name=data.get("hcp_name", ""),
        specialty=data.get("specialty", ""),
        interaction_type=data.get("interaction_type", ""),
        products_discussed=data.get("products_discussed", ""),
        notes=data.get("notes", ""),
        follow_up_date=data.get("follow_up_date", "")
    )

    db.add(interaction)
    db.commit()
    db.refresh(interaction)

    return {"message": "Saved successfully", "id": interaction.id}

@app.get("/interactions")
def get_interactions(db: Session = Depends(get_db)):
    return db.query(Interaction).all()

@app.put("/interactions/{interaction_id}")
def edit_interaction(interaction_id: int, data: dict, db: Session = Depends(get_db)):
    interaction = db.query(Interaction).filter(Interaction.id == interaction_id).first()

    if not interaction:
        return {"error": "Interaction not found"}

    interaction.hcp_name = data.get("hcp_name", interaction.hcp_name)
    interaction.specialty = data.get("specialty", interaction.specialty)
    interaction.interaction_type = data.get("interaction_type", interaction.interaction_type)
    interaction.products_discussed = data.get("products_discussed", interaction.products_discussed)
    interaction.notes = data.get("notes", interaction.notes)
    interaction.follow_up_date = data.get("follow_up_date", interaction.follow_up_date)

    db.commit()
    db.refresh(interaction)

    return {"message": "Interaction updated successfully"}