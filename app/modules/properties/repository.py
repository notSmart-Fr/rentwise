from sqlalchemy import select
from sqlalchemy.orm import Session

from app.modules.properties.model import Property

class PropertyRepository:
    def create(self, db: Session, prop: Property) -> Property:
        db.add(prop)
        db.commit()
        db.refresh(prop)
        return prop

    def get_by_id(self, db: Session, prop_id: bytes) -> Property | None:
        stmt = select(Property).where(Property.id == prop_id)
        return db.execute(stmt).scalar_one_or_none()

    def list_by_owner(self, db: Session, owner_id: bytes) -> list[Property]:
        stmt = select(Property).where(Property.owner_id == owner_id)
        return list(db.execute(stmt).scalars().all())

    def list_public(
        self,
        db: Session,
        city: str | None,
        area: str | None,
        min_rent: int | None,
        max_rent: int | None,
        beds: int | None,
    ) -> list[Property]:
        stmt = select(Property).where(Property.is_available == True)  # noqa: E712

        if city:
            stmt = stmt.where(Property.city == city)
        if area:
            stmt = stmt.where(Property.area == area)
        if min_rent is not None:
            stmt = stmt.where(Property.rent_amount >= min_rent)
        if max_rent is not None:
            stmt = stmt.where(Property.rent_amount <= max_rent)
        if beds is not None:
            stmt = stmt.where(Property.bedrooms == beds)

        return list(db.execute(stmt).scalars().all())
    def mark_as_unavailable(self, db: Session, prop_id: bytes) -> None:
        prop = self.get_by_id(db, prop_id)
        if prop:
            prop.is_available = False
            self.save(db, prop)

    def save(self, db: Session, prop: Property) -> Property:
        db.add(prop)
        db.commit()
        db.refresh(prop)
        return prop