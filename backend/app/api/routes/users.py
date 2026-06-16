from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.user import User
from app.schemas.user import UserRead

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=list[UserRead]) 
def list_users(db: Session = Depends(get_db)) -> list[User]:
    users = db.query(User).all()
    return users