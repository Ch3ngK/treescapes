from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.management_company import ManagementCompany
from app.schemas.company import ManagementCompanyRead
from app.models.user import User

router = APIRouter(prefix="/companies", tags=["companies"])

@router.get("/", response_model=list[ManagementCompanyRead])
def list_companies(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[ManagementCompany]:
    
    if current_user.role == "treescapes_admin":
        companies = db.query(ManagementCompany).all()
    else:
        companies = (
            db.query(ManagementCompany)
            .filter(ManagementCompany.id == current_user.management_company_id)
            .all()
        )
                    
    return companies

