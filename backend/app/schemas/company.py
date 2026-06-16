from pydantic import BaseModel

class ManagementCompanyRead(BaseModel):
    id: int
    name: str

    model_config = {"from_attributes": True} # Lets pydantic read from SQLALchemy model objects
