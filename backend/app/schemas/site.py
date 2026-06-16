from pydantic import BaseModel

class SiteRead(BaseModel): 
    id: int
    name: str 
    code: str | None 
    address: str | None
    management_company_id: int  

    model_config = {"from_attributes": True}