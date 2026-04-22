import uuid
from sqlalchemy.orm import Session
from app.persistence.base_service import BaseService
from app.core.errors import ForbiddenException
from app.modules.properties.model import Property, PropertyImage
from app.modules.properties.repository import PropertyRepository

class PropertyService(BaseService[Property]):
    def __init__(self) -> None:
        super().__init__(Property, PropertyRepository())

    def create(self, db: Session, owner_id: uuid.UUID, data) -> Property:
        prop = Property(
            owner_id=owner_id,
            title=data.title,
            description=data.description,
            city=data.city,
            area=data.area,
            address_text=data.address_text,
            rent_amount=data.rent_amount,
            bedrooms=data.bedrooms,
            bathrooms=data.bathrooms,
            is_available=True,
        )
        
        # Handle images
        if hasattr(data, 'image_urls') and data.image_urls:
            prop.images = [PropertyImage(url=url) for url in data.image_urls]
            
        return self.repo.create(db, prop)

    def get_for_owner(self, db: Session, property_id: uuid.UUID, owner_id: uuid.UUID) -> Property:
        prop = self.get_or_404(db, property_id)
        if prop.owner_id != owner_id:
            raise ForbiddenException(f"You do not have permission to access property {property_id}")
        return prop


    def update(self, db: Session, property_id: uuid.UUID, owner_id: uuid.UUID, data) -> Property:
        prop = self.get_for_owner(db, property_id, owner_id)
        update_data = data.model_dump(exclude_unset=True)
        
        # Handle image updates separately if present
        if 'image_urls' in update_data:
            urls = update_data.pop('image_urls')
            prop.images = [PropertyImage(url=url) for url in urls]
            
        return self.repo.update(db, prop, update_data)

    def update_availability(self, db: Session, property_id: uuid.UUID, owner_id: uuid.UUID, is_available: bool) -> Property:
        prop = self.get_for_owner(db, property_id, owner_id)
        prop.is_available = is_available
        return self.repo.create(db, prop) # Base repo create handles save

    def to_response(self, prop: Property) -> dict:
        data = super().to_response(prop)
        data["images"] = [{"id": str(img.id), "url": img.url} for img in prop.images]
        data["id"] = str(prop.id)
        data["owner_id"] = str(prop.owner_id)
        data["owner_name"] = prop.owner.full_name if prop.owner else None
        return data
