from datetime import datetime, UTC

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.api.deps import get_current_user, get_db
from app.models.checklist_item import ChecklistItem
from app.models.checklist_section import ChecklistSection
from app.models.checklist_template import ChecklistTemplate
from app.models.evaluation import Evaluation
from app.models.evaluation_response import EvaluationResponse
from app.models.site import Site
from app.models.user import User
from app.schemas.evaluation import EvaluationCreate, EvaluationRead

router = APIRouter(prefix="/evaluations", tags=["evaluations"])

# Helper function
def get_benchmark_band(percentage: float) -> str | None:
    if percentage >= 95:
        return "Bonus Incentive (1%)"
    if percentage >= 85: 
        return "Full Payment"
    if percentage >= 80:
        return "90% payment"
    if percentage >= 75:
        return "80% payment"
    if percentage >= 70:
        return "70% payment"
    return None

@router.post("/", response_model=EvaluationRead, status_code=status.HTTP_201_CREATED)
def create_evaluation(
    payload: EvaluationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Evaluation:
    site = db.query(Site).filter(Site.id == payload.site_id).first()
    if site is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site not found.",
        )
    
    if current_user.role != "treescapes_admin":
        if site.management_company_id != current_user.management_company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot submit evaluations for another company's site.",
            )
        
    template = (
        db.query(ChecklistTemplate)
        .options(
            selectinload(ChecklistTemplate.sections)
            .selectinload(ChecklistSection.items)
        )
        .filter(ChecklistTemplate.id == payload.template_id)
        .first()
    )

    if template is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Checklist template not found.",
        ) 
    
    allowed_items: dict[int, ChecklistItem] = {}
    for section in template.sections:
        for item in section.items:
            allowed_items[item.id] = item

    if not payload.responses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one checklist response is required.",
        ) 
    
    total_score = 0.0 
    max_total = 0.0

    for response in payload.responses:
        checklist_item = allowed_items.get(response.checklist_item_id)

        if checklist_item is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Checklist item {response.checklist_item_id} does not belong to template {template.id}.",
            )
        
        if response.score < 0 or response.score > float(checklist_item.max_points):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Score for item {checklist_item.code} must be between 0 "
                    f"and {float(checklist_item.max_points)}."
                ),
            )
        total_score += response.score
        max_total += float(checklist_item.max_points)

    percentage = round((total_score / max_total) * 100, 2) if max_total else 0.0
    benchmark_band = get_benchmark_band(percentage)

    evaluation = Evaluation(
        site_id=payload.site_id,
        evaluator_id=current_user.id,
        template_id=payload.template_id,
        evaluation_date=payload.evaluation_date,
        submitted_at=datetime.now(UTC),
        total_score=round(total_score, 2),
        percentage=percentage,
        benchmark_band=benchmark_band,
        general_comments=payload.general_comments,
        site_in_charge_name=payload.site_in_charge_name,
        horticulturist_in_charge_name=payload.horticulturist_in_charge_name,
        site_in_charge_signature_url=payload.site_in_charge_signature_url,
        horticulturist_in_charge_signature_url=payload.horticulturist_in_charge_signature_url,
        status="submitted",
    )

    db.add(evaluation)
    db.flush()

    for response in payload.responses:
        evaluation_response = EvaluationResponse(
            evaluation_id=evaluation.id,
            checklist_item_id=response.checklist_item_id,
            score=response.score,
            remarks=response.remarks,
            image_url=response.image_url,
        )
        db.add(evaluation_response)

    db.commit()

    saved_evaluation = (
        db.query(Evaluation)
        .options(
            selectinload(Evaluation.responses)
            .selectinload(EvaluationResponse.checklist_item)
        )
        .filter(Evaluation.id == evaluation.id)
        .first()
    )

    return saved_evaluation

@router.get("/", response_model=list[EvaluationRead])
def list_evaluations(
    site_id: int | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[Evaluation]:
    query = ( 
        db.query(Evaluation)
        .options(
            selectinload(Evaluation.responses)
            .selectinload(EvaluationResponse.checklist_item)
        )
    )

    if current_user.role != "treescapes_admin":
        query = (
            query.join(Site, Evaluation.site_id == Site.id)
            .filter(Site.management_company_id == current_user.management_company_id)
        )
    
    if site_id is not None: # For if the frontend requests a specific site
        query = query.filter(Evaluation.site_id == site_id)

    return query.all()

@router.get("/{evaluation_id}", response_model=EvaluationRead)
def get_evaluation(
    evaluation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Evaluation:
    evaluation = (
        db.query(Evaluation)
        .options(
            selectinload(Evaluation.responses)
            .selectinload(EvaluationResponse.checklist_item)
        )
        .filter(Evaluation.id == evaluation_id)
        .first()
    )

    if evaluation is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evaluation not found."
        )
    
    if current_user.role != "treescapes_admin":
        site = db.query(Site).filter(Site.id == evaluation.site_id).first()

        if site is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Site not found for this evaluation."
            )
        
        if site.management_company_id != current_user.management_company_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="You cannot access this evaluation.",
            )

    return evaluation

@router.delete("/{evaluation_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_evaluations(
    evaluation_id: int, 
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> None:
    evaluation = (
        db.query(Evaluation)
        .options(selectinload(Evaluation.responses))
        .filter(Evaluation.id == evaluation_id)
        .first()
    )

    if evaluation is None: 
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Evaluation not found.",
        )

    if current_user.role != "treescapes_admin":
        site = db.query(Site).filter(Site.id == evaluation.site_id).first()

        if site is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Site not found for this evaluation.",
            )
        
        if site.management_company_id != current_user.management_company_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot delete this evaluation.",
            )

    for response in evaluation.responses:
        db.delete(response) 

    db.delete(evaluation)
    db.commit()
