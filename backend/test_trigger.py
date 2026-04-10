import requests
from database import SessionLocal
from routers.collection import trigger_ai_agent_on_login

db = SessionLocal()
res = trigger_ai_agent_on_login(db)
print(res)
