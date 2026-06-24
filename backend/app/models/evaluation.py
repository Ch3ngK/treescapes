from datetime import date, datetime

from sqlalchemy import Date, DateTime, ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Evaluation(Base):
    __tablename__ = "evaluations"

    id: Mapped[int] = mapped_column(primary_key=True)
    site_id: Mapped[int] = mapped_column(ForeignKey("sites.id"), nullable=False)
    evaluator_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    template_id: Mapped[int] = mapped_column(ForeignKey("checklist_templates.id"), nullable=False)

    evaluation_date: Mapped[date] = mapped_column(Date, nullable=False)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)

    total_score: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    percentage: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)

    benchmark_band: Mapped[str | None] = mapped_column(String(100), nullable=True)
    general_comments: Mapped[str | None] = mapped_column(Text, nullable=True)
    site_in_charge_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    horticulturist_in_charge_name: Mapped[str | None] = mapped_column(String(255), nullable=True)

    status: Mapped[str] = mapped_column(String(50), nullable=False, default="submitted")

    site = relationship("Site")
    evaluator = relationship("User")
    template = relationship("ChecklistTemplate")
    responses = relationship("EvaluationResponse", back_populates="evaluation")