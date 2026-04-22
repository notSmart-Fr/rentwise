import pytest
from unittest.mock import MagicMock
from app.modules.auth.service import AuthService
from app.modules.auth.model import User

@pytest.fixture
def auth_service():
    service = AuthService()
    # Mock the repository to avoid database issues for logic testing
    service.repo = MagicMock()
    return service

def test_register_new_user(auth_service):
    # Arrange
    db = MagicMock()
    auth_service.repo.get_by_email.return_value = None
    auth_service.repo.create.side_effect = lambda db, user: user
    
    # Act
    user = auth_service.register(
        db=db,
        role="TENANT",
        full_name="Test User",
        email="test@example.com",
        phone="123456789",
        password="securepassword"
    )
    
    # Assert
    assert user.email == "test@example.com"
    assert user.full_name == "Test User"
    assert user.is_owner is True  # Based on the "dual-mode" logic in service.py
    auth_service.repo.create.assert_called_once()

def test_register_duplicate_email(auth_service):
    # Arrange
    db = MagicMock()
    auth_service.repo.get_by_email.return_value = User(email="test@example.com")
    
    # Act & Assert
    with pytest.raises(ValueError) as excinfo:
        auth_service.register(
            db=db,
            role="TENANT",
            full_name="Test User",
            email="test@example.com",
            phone="123456789",
            password="password"
        )
    
    assert str(excinfo.value) == "Email already registered"
