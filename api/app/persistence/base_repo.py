from typing import TypeVar, Generic, Type, Any, List, Optional
import uuid
from sqlalchemy.orm import Session
from app.persistence.base import Base

T = TypeVar("T", bound=Base)

class BaseRepository(Generic[T]):
    """
    Base Repository with common CRUD operations.
    Inherit from this and specify the model class.
    """
    def __init__(self, model: Type[T]):
        self.model = model

    def get_by_id(self, db: Session, id: Any) -> Optional[T]:
        if isinstance(id, str):
            try:
                id = uuid.UUID(id)
            except ValueError:
                pass
        return db.query(self.model).filter(self.model.id == id).first()

    def list_all(self, db: Session, skip: int = 0, limit: int = 100) -> List[T]:
        return db.query(self.model).offset(skip).limit(limit).all()

    def create(self, db: Session, obj_in: T) -> T:
        db.add(obj_in)
        db.commit()
        db.refresh(obj_in)
        return obj_in

    def update(self, db: Session, db_obj: T, obj_in: dict[str, Any] | T) -> T:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = {c.name: getattr(obj_in, c.name) for c in obj_in.__table__.columns}

        for field in update_data:
            if hasattr(db_obj, field):
                setattr(db_obj, field, update_data[field])

        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def remove(self, db: Session, id: Any) -> Optional[T]:
        obj = db.query(self.model).get(id)
        if obj:
            db.delete(obj)
            db.commit()
        return obj
