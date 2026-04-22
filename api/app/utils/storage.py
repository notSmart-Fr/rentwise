import os
import uuid
from abc import ABC, abstractmethod
from fastapi import UploadFile
import shutil
from pathlib import Path

class StorageProvider(ABC):
    @abstractmethod
    async def upload(self, file: UploadFile, folder: str) -> str:
        pass

    @abstractmethod
    async def delete(self, file_url: str) -> bool:
        pass

class LocalStorage(StorageProvider):
    def __init__(self, upload_dir: str = "uploads"):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        # Assuming we serve this via static files at /uploads
        self.base_url = "/uploads"

    async def upload(self, file: UploadFile, folder: str) -> str:
        folder_path = self.upload_dir / folder
        folder_path.mkdir(parents=True, exist_ok=True)

        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = folder_path / unique_filename

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        return f"{self.base_url}/{folder}/{unique_filename}"

    async def delete(self, file_url: str) -> bool:
        if not file_url.startswith(self.base_url):
            return False
        
        relative_path = file_url.replace(self.base_url, "").lstrip("/")
        file_path = self.upload_dir / relative_path
        
        if file_path.exists():
            file_path.unlink()
            return True
        return False

# Singleton instance
storage = LocalStorage()
