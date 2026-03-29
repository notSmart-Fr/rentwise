import uuid
from sqlalchemy import select, update, delete
from sqlalchemy.orm import Session
from app.modules.leases.model import Lease
from app.modules.leases.schemas import LeaseCreateSchema, LeaseUpdateSchema

class LeaseRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_lease(self, lease: LeaseCreateSchema) -> Lease:
        db_lease = Lease(
            tenant_id=lease.tenant_id,
            property_id=lease.property_id,
            start_date=lease.start_date,
            end_date=lease.end_date,
            monthly_rent=lease.monthly_rent
        )
        self.db.add(db_lease)
        self.db.commit()
        self.db.refresh(db_lease)
        return db_lease

    def get_lease_by_id(self, lease_id: uuid.UUID) -> Lease | None:
        return self.db.get(Lease, lease_id)

    def get_all_leases(self, skip: int = 0, limit: int = 100) -> list[Lease]:
        statement = select(Lease).offset(skip).limit(limit)
        result = self.db.execute(statement)
        return result.scalars().all()

    def update_lease(self, lease_id: uuid.UUID, lease_data: LeaseUpdateSchema) -> Lease | None:
        db_lease = self.get_lease_by_id(lease_id)
        if db_lease:
            update_data = lease_data.model_dump(exclude_unset=True)
            for key, value in update_data.items():
                setattr(db_lease, key, value)
            self.db.commit()
            self.db.refresh(db_lease)
        return db_lease

    def delete_lease(self, lease_id: uuid.UUID) -> Lease | None:
        db_lease = self.get_lease_by_id(lease_id)
        if db_lease:
            self.db.delete(db_lease)
            self.db.commit()
        return db_lease
