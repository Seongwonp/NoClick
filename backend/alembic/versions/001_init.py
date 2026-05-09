"""init

Revision ID: 001
Revises:
Create Date: 2026-05-09

"""
from alembic import op
import sqlalchemy as sa

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'analyses',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('session_id', sa.String(), nullable=True, index=True),
        sa.Column('platform', sa.String(), nullable=True),
        sa.Column('model_used', sa.String(), nullable=True),
        sa.Column('original_content', sa.Text(), nullable=True),
        sa.Column('blog_title', sa.String(), nullable=True),
        sa.Column('ad_probability', sa.Integer(), nullable=True),
        sa.Column('trust_score', sa.Integer(), nullable=True),
        sa.Column('highlighted_phrases', sa.JSON(), nullable=True),
        sa.Column('hidden_negatives', sa.JSON(), nullable=True),
        sa.Column('hidden_intent', sa.Text(), nullable=True),
        sa.Column('overall_verdict', sa.Text(), nullable=True),
        sa.Column('real_summary', sa.Text(), nullable=True),
        sa.Column('saved_cost', sa.String(), nullable=True),
        sa.Column('saved_time', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now()),
    )


def downgrade() -> None:
    op.drop_table('analyses')
