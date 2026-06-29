from sqlalchemy import ForeignKey, Numeric, Text, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class EvaluationResponse(Base):
    __tablename__ = "evaluation_responses"

    id: Mapped[int] = mapped_column(primary_key=True)
    evaluation_id: Mapped[int] = mapped_column(ForeignKey("evaluations.id"), nullable=False)
    checklist_item_id: Mapped[int] = mapped_column(ForeignKey("checklist_items.id"), nullable=False)

    score: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    remarks: Mapped[str | None] = mapped_column(Text, nullable=True)

    evaluation = relationship("Evaluation", back_populates="responses")
    checklist_item = relationship("ChecklistItem")
    image_url: Mapped[str | None] = mapped_column(String(1000), nullable=True)