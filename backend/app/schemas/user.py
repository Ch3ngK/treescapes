from pydantic import BaseModel, EmailStr

class UserRead(BaseModel):
    id: int
    email: EmailStr # EmailStr: String that must look like a valid email address
    full_name: str
    role: str 
    management_company_id: int | None

    model_config = {"from_attributes": True}