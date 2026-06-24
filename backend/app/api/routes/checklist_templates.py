from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user, get_db
from app.models.checklist_template import ChecklistTemplate
from app.models.user import User
from app.schemas.checklist import ChecklistTemplateRead
from app.models.checklist_section import ChecklistSection

router = APIRouter(prefix="/checklist-templates", tags=["checklist_templates"])


@router.get("/active", response_model=ChecklistTemplateRead)
def get_active_checklist_template(
        current_user: User = Depends(get_current_user),
        db: Session = Depends(get_db)
) -> ChecklistTemplate:
    template = (
        db.query(ChecklistTemplate)
        .options(
            selectinload(ChecklistTemplate.sections)
            .selectinload(ChecklistSection.items)
        )
        .filter(ChecklistTemplate.is_active == True)
        .first()
    )

    if template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No active checklist template found.",
        )
    
    template.sections.sort(key=lambda section: section.display_order)
    for section in template.sections:
        section.items.sort(key=lambda item: item.display_order)

    return template