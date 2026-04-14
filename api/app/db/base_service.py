from typing import TypeVar, Generic, Type, Any, List, Optional
import uuid
from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.base_repo import BaseRepository

T = TypeVar("T", bound=Base)

class BaseService(Generic[T]):
    """
    Base Service with common orchestration logic.
    Inherit from this and specify the model and repository.
    """
    def __init__(self, model: Type[T], repository: BaseRepository[T]):
        self.model = model
        self.repo = repository

    def get_or_404(self, db: Session, id: Any) -> T:
        """
        Fetches an object by ID or raises a ValueError if not found.
        The global exception handler will catch this and return a 400.
        """
        obj = self.repo.get_by_id(db, id)
        if not obj:
            raise ValueError(f"{self.model.__name__} with ID {id} not found")
        return obj

    def list_all(self, db: Session, **kwargs) -> List[T]:
        """Generic list all."""
        return self.repo.list_all(db, **kwargs)

    def to_response(self, obj: T) -> dict:
        """
        Base dictionary mapping. 
        Most models have an id and common timestamps.
        Override this for custom mapping.
        """
        return {
            c.name: getattr(obj, c.name) 
            for c in obj.__table__.columns
        }

    def to_response_list(self, items: List[T]) -> List[dict]:
        return [self.to_response(item) for item in items]
