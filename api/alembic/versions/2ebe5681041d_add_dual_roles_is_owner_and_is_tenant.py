"""Add dual roles is_owner and is_tenant

Revision ID: 2ebe5681041d
Revises: c2d3cd9d41c4
Create Date: 2026-04-21 20:35:52.765264

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '2ebe5681041d'
down_revision: Union[str, Sequence[str], None] = 'c2d3cd9d41c4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Add columns as nullable first
    op.add_column('users', sa.Column('is_owner', sa.Boolean(), nullable=True))
    op.add_column('users', sa.Column('is_tenant', sa.Boolean(), nullable=True))
    
    # 2. Data Migration: Set both to True for everyone (Airbnb style)
    # This ensures no one is locked out of either mode.
    op.execute("UPDATE users SET is_owner = true, is_tenant = true")
    
    # 3. Drop 'role' column and set new columns to NOT NULL
    # Using batch mode for compatibility, though on Postgres it's direct.
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('is_owner', nullable=False)
        batch_op.alter_column('is_tenant', nullable=False)
        batch_op.drop_column('role')


def downgrade() -> None:
    op.add_column('users', sa.Column('role', sa.VARCHAR(length=10), nullable=True))
    op.execute("UPDATE users SET role = 'TENANT'")
    
    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('role', nullable=False)
        batch_op.drop_column('is_owner')
        batch_op.drop_column('is_tenant')
