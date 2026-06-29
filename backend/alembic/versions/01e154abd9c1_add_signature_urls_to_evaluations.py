"""add signature urls to evaluations

Revision ID: 01e154abd9c1
Revises: <new_revision_id>
Create Date: 2026-06-29 13:14:36.767721

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '01e154abd9c1'
down_revision: Union[str, Sequence[str], None] = '<new_revision_id>'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column(
        "evaluations",
        sa.Column("site_in_charge_signature_url", sa.String(length=1000), nullable=True),
    )
    op.add_column(
        "evaluations",
        sa.Column("horticulturist_in_charge_signature_url", sa.String(length=1000), nullable=True),
    )
    pass

def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column("evaluations", "horticulturist_in_charge_signature_url")
    op.drop_column("evaluations", "site_in_charge_signature_url")
    pass
