from pathlib import Path 
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from supabase import create_client

from app.api.deps import get_current_user
from app.core.config import (
        SUPABASE_SERVICE_ROLE_KEY,
        SUPABASE_STORAGE_BUCKET,
        SUPABASE_URL,
)
from app.models.user import User

router = APIRouter(prefix="/uploads", tags=["uploads"])

@router.post("/evidence")
async def upload_evidence(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY or not SUPABASE_STORAGE_BUCKET:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Supabase storage is not configured."
        )
    
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only image uploads are allowed.",
        )
    
    contents = await file.read()
    suffix = Path(file.filename or "").suffix.lower() or ".jpg"
    storage_path = f"evaluations/{current_user.id}/{uuid4()}{suffix}"

    client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    client.storage.from_(SUPABASE_STORAGE_BUCKET).upload(
        storage_path,
        contents,
        {"content-type": file.content_type}
    )

    public_url = client.storage.from_(SUPABASE_STORAGE_BUCKET).get_public_url(storage_path)

    return {
        "url": public_url,
        "storage_path": storage_path,
    }