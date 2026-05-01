from sqlalchemy import Column, Integer, String, Text
from database import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True)
    hcp_name = Column(String)
    specialty = Column(String)
    interaction_type = Column(String)
    products_discussed = Column(Text)
    notes = Column(Text)
    follow_up_date = Column(String)