from app.db.base_repo import BaseRepository
from app.modules.properties.model import Property

class PropertyRepository(BaseRepository[Property]):
    def __init__(self):
        super().__init__(Property)

    def list_by_owner(self, db: Session, owner_id: uuid.UUID) -> list[Property]:
        stmt = select(Property).where(Property.owner_id == owner_id)
        return list(db.execute(stmt).scalars().all())

    def list_public(
        self,
        db: Session,
        city: str | None = None,
        area: str | None = None,
        min_rent: int | None = None,
        max_rent: int | None = None,
        beds: int | None = None,
        search: str | None = None,
    ) -> list[Property]:
        stmt = select(Property).where(Property.is_available == True)  # noqa: E712

        if search:
            search_filter = f"%{search}%"
            stmt = stmt.where(
                or_(
                    Property.title.ilike(search_filter),
                    Property.description.ilike(search_filter),
                    Property.city.ilike(search_filter),
                    Property.area.ilike(search_filter),
                )
            )

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

    def mark_as_unavailable(self, db: Session, prop_id: uuid.UUID) -> None:
        prop = self.get_by_id(db, prop_id)
        if prop:
            prop.is_available = False
            self.create(db, prop) # BaseRepository.create acts as save/add
