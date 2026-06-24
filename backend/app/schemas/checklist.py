from pydantic import BaseModel

class ChecklistItemRead(BaseModel):
    id: int
    code: str
    description: str
    max_points: float
    display_order: int  

    model_config = {"from_attributes": True}

class ChecklistSectionRead(BaseModel):
    id: int
    code: str 
    title: str 
    max_points: float 
    display_order: int
    items: list[ChecklistItemRead] = []

    model_config = {"from_attributes": True}

class ChecklistTemplateRead(BaseModel):
    id: int
    name: str
    description: str | None
    version: str | None 
    is_active: bool
    sections: list[ChecklistSectionRead] = []

    model_config = {"from_attributes": True}