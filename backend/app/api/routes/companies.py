from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.management_company import ManagementCompany
from app.schemas.company import ManagementCompanyRead

router = APIRouter(prefix="/companies", tags=["companies"])

@router.get("/", response_model=list[ManagementCompanyRead])
def list_companies(db: Session = Depends(get_db)) -> list[ManagementCompany]:
    companies = db.query(ManagementCompany).all()
    return companies

