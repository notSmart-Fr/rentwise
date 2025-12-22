import uuid
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.deps import get_db
from app.modules.auth.deps import require_owner
from app.modules.auth.model import User
from app.modules.properties.schemas import (
    PropertyCreateRequest,
    PropertyUpdateRequest,
    AvailabilityRequest,
    PropertyResponse,
)
from app.modules.properties.service import PropertyService
from app.modules.properties.repository import PropertyRepository

router = APIRouter(tags=["properties"])
service = PropertyService()
repo = PropertyRepository()

# OWNER endpoints
owner_router = APIRouter(prefix="/owner", tags=["owner-properties"])

@owner_router.post("/properties", response_model=PropertyResponse)
def create_property(
    payload: PropertyCreateRequest,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    prop = service.create(db, owner.id, payload)
    return service.to_response(prop)

@owner_router.get("/properties", response_model=list[PropertyResponse])
def list_my_properties(
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    props = repo.list_by_owner(db, owner.id)
    return [service.to_response(p) for p in props]

@owner_router.patch("/properties/{property_id}", response_model=PropertyResponse)
def update_property(
    property_id: str,
    payload: PropertyUpdateRequest,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    prop_id = uuid.UUID(property_id).bytes
    prop = repo.get_by_id(db, prop_id)
    if not prop or prop.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Property not found")
    prop = service.update(db, prop, payload)
    return service.to_response(prop)

@owner_router.patch("/properties/{property_id}/availability", response_model=PropertyResponse)
def set_availability(
    property_id: str,
    payload: AvailabilityRequest,
    db: Session = Depends(get_db),
    owner: User = Depends(require_owner),
):
    prop_id = uuid.UUID(property_id).bytes
    prop = repo.get_by_id(db, prop_id)
    if not prop or prop.owner_id != owner.id:
        raise HTTPException(status_code=404, detail="Property not found")
    prop.is_available = payload.is_available
    prop = repo.save(db, prop)
    return service.to_response(prop)

# PUBLIC endpoints
public_router = APIRouter(prefix="/properties", tags=["public-properties"])

@public_router.get("", response_model=list[PropertyResponse])
def browse_properties(
    db: Session = Depends(get_db),
    city: str | None = None,
    area: str | None = None,
    min_rent: int | None = Query(default=None, ge=0),
    max_rent: int | None = Query(default=None, ge=0),
    beds: int | None = Query(default=None, ge=0),
):
    props = repo.list_public(db, city, area, min_rent, max_rent, beds)
    return [service.to_response(p) for p in props]

@public_router.get("/{property_id}", response_model=PropertyResponse)
def get_property(property_id: str, db: Session = Depends(get_db)):
    prop_id = uuid.UUID(property_id).bytes
    prop = repo.get_by_id(db, prop_id)
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    return service.to_response(prop)