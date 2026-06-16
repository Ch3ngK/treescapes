from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

class ManagementCompany(Base):
    __tablename__ = "management_companies"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

    users = relationship("User", back_populates="management_company")
    sites = relationship("Site", back_populates="management_company")