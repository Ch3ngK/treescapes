# Shared dependency functions for FastAPI

from collections.abc import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import JWT_ALGORITHM, JWT_SECRET_KEY
from app.db.session import SessionLocal
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login") # Informs FastAPI that protected routes expect a bearer token.


def get_db() -> Generator: 
    db = SessionLocal()
    try:
        yield db
    finally: 
        db.close()

def get_current_user(
    token: str = Depends(oauth2_scheme), # FastAPI reads the Authorization header, extracts bearer token, gives token string to get_current_user.
    db: Session = Depends(get_db),
) -> User: 
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
    )

    try: 
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        subject = payload.get("sub")

        if subject is None:
            raise credentials_exception
        
    except JWTError: 
        raise credentials_exception
    
    user = db.query(User).filter(User.email == subject).first()

    if user is None: 
        raise credentials_exception
    
    return user