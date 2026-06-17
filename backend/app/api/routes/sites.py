from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_db
from app.models.site import Site
from app.schemas.site import SiteRead
from app.models.user import User

router = APIRouter(prefix="/sites", tags=["sites"])

@router.get("/", response_model=list[SiteRead])
def list_sites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[Site]:
    if current_user.role == "treescapes_admin":
        sites = db.query(Site).all()
    else:  
        sites = (
            db.query(Site)
            .filter(Site.management_company_id == current_user.management_company_id)
            .all()
        )
    return sites
