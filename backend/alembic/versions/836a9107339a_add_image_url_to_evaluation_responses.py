"""add image url to evaluation responses

Revision ID: 836a9107339a
Revises: 8c6f07b8cbf7
Create Date: 2026-06-25

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "<new_revision_id>"
down_revision: Union[str, Sequence[str], None] = "8c6f07b8cbf7"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "evaluation_responses",
        sa.Column("image_url", sa.String(length=1000), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("evaluation_responses", "image_url")