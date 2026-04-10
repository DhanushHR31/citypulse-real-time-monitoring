from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel
import hashlib
import random
import string
from services.email_service import send_login_notification_email, send_login_with_report_email
from services.gemini import generate_login_incident_report

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

async def handle_login_notification(email: str, name: str):
    """AI SENTINEL: Generates 30-incident report and sends email in background."""
    print(f"🚀 AI Agent starting deep search for 30 live incidents for {email}...")
    try:
        # generate_login_incident_report now always returns 30 items (real or fallback)
        incidents = generate_login_incident_report()
        
        print(f"✅ AI Report Prepared: Dispatching premium email to {email}...")
        send_login_with_report_email(email, name, incidents[:30])
        
    except Exception as e:
        print(f"🚨 Critical Failure in Login Notification: {e}")
        # Very final safety net - simple email
        send_login_notification_email(email, name)

@router.post("/register")
def register_user(user: UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
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
    
    # Send Welcome/Login Email
    background_tasks.add_task(handle_login_notification, new_user.email, new_user.name or new_user.email)
    
    # Log registration
    log = models.UserLog(user_id=new_user.id, username=new_user.email, action="REGISTER")
    db.add(log)
    db.commit()
    
    return {"message": "User registered successfully", "user": {"id": new_user.id, "email": new_user.email, "name": new_user.name, "phone": new_user.phone}}

@router.post("/login")
def login_user(user: UserLogin, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    if db_user.password != hash_password(user.password):
        raise HTTPException(status_code=400, detail="Invalid email or password")
    
    # Send Login Notification Email
    background_tasks.add_task(handle_login_notification, db_user.email, db_user.name or db_user.email)
    
    # Log directly for faster user experience in demo.
    log = models.UserLog(user_id=db_user.id, username=db_user.email, action="LOGIN_SUCCESS")
    db.add(log)
    db.commit()
    
    return {
        "status": "success",
        "message": "Login successful",
        "user": {
            "id": db_user.id,
            "email": db_user.email,
            "name": db_user.name,
            "phone": db_user.phone,
            "role": db_user.role
        }
    }

@router.get("/logs")
def get_user_logs(db: Session = Depends(get_db)):
    logs = db.query(models.UserLog).order_by(models.UserLog.timestamp.desc()).all()
    return [{"id": l.id, "username": l.username, "action": l.action, "timestamp": l.timestamp.isoformat(), "info": l.log_info} for l in logs]

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
    
    db.query(models.UserLog).filter(models.UserLog.user_id == user_id).delete()
    db.delete(db_user)
    db.commit()
    return {"message": "User deleted successfully"}
