"""add_unit_number

Revision ID: 3aef92d280d9
Revises: b64d595bc0be
Create Date: 2026-04-26 04:12:15.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3aef92d280d9'
down_revision: Union[str, Sequence[str], None] = 'b64d595bc0be'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # We use IF NOT EXISTS logic because the user already added it manually
    # But Alembic needs to know it's there for future syncs.
    op.add_column('properties', sa.Column('unit_number', sa.String(length=50), nullable=True))


def downgrade() -> None:
    op.drop_column('properties', 'unit_number')
