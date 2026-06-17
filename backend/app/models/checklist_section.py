from sqlalchemy import ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

class ChecklistSection(Base):
    __tablename__ = "checklist_sections"

    id: Mapped[int] = mapped_column(primary_key=True)
    template_id: Mapped[int] = mapped_column(
        ForeignKey("checklist_templates.id"),
        nullable=False,
    )
    code: Mapped[str] = mapped_column(String(10), nullable=False) # A, B, C, ...
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    max_points: Mapped[float] = mapped_column(Numeric(10, 2), nullable=False)
    display_order: Mapped[int] = mapped_column(nullable=False)

    template = relationship("ChecklistTemplate", back_populates="sections")
    items = relationship("ChecklistItem", back_populates="section")