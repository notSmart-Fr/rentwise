import os
import uuid
from abc import ABC, abstractmethod
from fastapi import UploadFile
import shutil
from pathlib import Path
from app.core.config import settings

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

class CloudStorage(StorageProvider):
    def __init__(self, bucket_name: str):
        from google.cloud import storage as gcs
        self.client = gcs.Client()
        self.bucket = self.client.bucket(bucket_name)

    async def upload(self, file: UploadFile, folder: str) -> str:
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{folder}/{uuid.uuid4()}{file_extension}"
        blob = self.bucket.blob(unique_filename)
        
        # Upload from stream
        blob.upload_from_file(file.file, content_type=file.content_type)
        
        # Make public (optional, or use signed URLs)
        # For now, we'll assume the bucket has uniform bucket-level access or we make it public
        blob.make_public()
        
        return blob.public_url

    async def delete(self, file_url: str) -> bool:
        # Extract blob name from URL
        # URL format: https://storage.googleapis.com/[BUCKET]/[BLOB]
        blob_name = file_url.split(f"/{self.bucket.name}/")[-1]
        blob = self.bucket.blob(blob_name)
        if blob.exists():
            blob.delete()
            return True
        return False

# Singleton instance selection
if settings.storage_type == "gcs" and settings.gcs_bucket:
    storage = CloudStorage(settings.gcs_bucket)
else:
    storage = LocalStorage()

