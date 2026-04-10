import uuid
from sqlalchemy.orm import Session

from app.modules.properties.model import Property, PropertyImage
from app.modules.properties.repository import PropertyRepository

class PropertyService:
    def __init__(self) -> None:
        self.repo = PropertyRepository()

    def create(self, db: Session, owner_id: bytes, data) -> Property:
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

    def update(self, db: Session, prop: Property, data) -> Property:
        update_data = data.model_dump(exclude_unset=True)
        
        # Handle image updates separately if present
        if 'image_urls' in update_data:
            urls = update_data.pop('image_urls')
            prop.images = [PropertyImage(url=url) for url in urls]
            
        for field, value in update_data.items():
            setattr(prop, field, value)
            
        return self.repo.save(db, prop)

    def to_response(self, prop: Property) -> dict:
        return {
            "id": str(prop.id),
            "owner_id": str(prop.owner_id),
            "title": prop.title,
            "description": prop.description,
            "city": prop.city,
            "area": prop.area,
            "address_text": prop.address_text,
            "rent_amount": prop.rent_amount,
            "bedrooms": prop.bedrooms,
            "bathrooms": prop.bathrooms,
            "is_available": prop.is_available,
            "images": [{"id": str(img.id), "url": img.url} for img in prop.images]
        }
