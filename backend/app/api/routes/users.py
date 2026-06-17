from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.user import User
from app.models.management_company import ManagementCompany
from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=list[UserRead]) 
def list_users(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[User]:
    
    if current_user.role == "treescapes_admin":
        users = db.query(User).all()
    else:
        users = (
            db.query(User)
            .filter(User.management_company_id == current_user.management_company_id)
            .all()
        )
    return users