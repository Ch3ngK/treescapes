from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.site import Site
from app.schemas.site import SiteRead

router = APIRouter(prefix="/sites", tags=["sites"])

@router.get("/", response_model=list[SiteRead])
def list_sites(db: Session = Depends(get_db)) -> list[Site]:
    sites = db.query(Site).all()
    return sites
