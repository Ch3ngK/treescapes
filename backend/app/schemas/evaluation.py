from datetime import date

from pydantic import BaseModel

from app.schemas.checklist import ChecklistItemRead

# For one item's answer
class EvaluationResponseCreate(BaseModel): 
    checklist_item_id: int
    score: float 
    remarks: str | None = None 
    image_url: str | None = None

# For whole evaluation submission
class EvaluationCreate(BaseModel):
    site_id: int 
    template_id: int 
    evaluation_date: date
    general_comments: str | None = None
    site_in_charge_name: str | None = None 
    horticulturist_in_charge_name: str | None = None 
    site_in_charge_signature_url: str | None = None
    horticulturist_in_charge_signature_url: str| None = None
    responses: list[EvaluationResponseCreate]

class EvaluationResponseRead(BaseModel): 
    id: int
    checklist_item_id: int 
    checklist_item: ChecklistItemRead
    score: float 
    remarks: str | None = None
    image_url: str | None = None
    model_config = {"from_attributes": True}

class EvaluationRead(BaseModel):
    id: int
    site_id: int
    evaluator_id: int
    template_id: int
    evaluation_date: date
    total_score: float
    percentage: float
    benchmark_band: str | None
    general_comments: str | None
    site_in_charge_name: str | None
    horticulturist_in_charge_name: str | None
    status: str
    responses: list[EvaluationResponseRead] = []
    site_in_charge_signature_url: str | None = None
    horticulturist_in_charge_signature_url: str| None = None

    model_config = {"from_attributes": True}
