from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
import hashlib

router = APIRouter(prefix="/users", tags=["users"])

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

class UserCreate(BaseModel):
    name: str = ""
    email: str
    password: str
    phone: str = ""

class UserLogin(BaseModel):
    email: str
    password: str

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = hash_password(user.password)
    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashed_pw,
        phone=user.phone,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User registered successfully", "user": {"id": new_user.id, "email": new_user.email, "name": new_user.name, "phone": new_user.phone}}

@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if db_user.password != hash_password(user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
        
    return {"message": "Login successful", "user": {"id": db_user.id, "email": db_user.email, "name": db_user.name, "phone": db_user.phone, "role": db_user.role}}

@router.get("/")
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    result = []
    for u in users:
        result.append({
            "id": u.id,
            "name": u.name or "",
            "email": u.email,
            "role": u.role,
            "phone": u.phone or "",
            "location": u.location or "-",
            "emergency_contact": u.emergency_contact or "-"
        })
    return result

class UserUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    role: str | None = None

@router.put("/{user_id}")
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user_update.name is not None:
        db_user.name = user_update.name
    if user_update.email is not None:
        db_user.email = user_update.email
    if user_update.phone is not None:
        db_user.phone = user_update.phone
    if user_update.role is not None:
        db_user.role = user_update.role
        
    db.commit()
    db.refresh(db_user)
    return {"message": "User updated successfully"}

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
