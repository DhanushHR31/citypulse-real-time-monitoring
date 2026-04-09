import requests
import sqlite3
import os

print('--- REGISTERING ---')
try:
    res1 = requests.post('http://127.0.0.1:8000/users/register', json={'name':'Test Bot', 'email':'testbot@citypulse.gov', 'password':'password123', 'phone':'1234567890'}, timeout=5)
    print('Register Status:', res1.status_code)
    print('Register Body:', res1.json())
except Exception as e:
    print("Registration Failed:", e)

print('\n--- LOGGING IN ---')
try:
    res2 = requests.post('http://127.0.0.1:8000/users/login', json={'email':'testbot@citypulse.gov', 'password':'password123'}, timeout=5)
    print('Login Status:', res2.status_code)
    print('Login Body:', res2.json())
except Exception as e:
    print("Login Failed:", e)

print('\n--- CHECKING DB DIRECTLY ---')
db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'smart_city.db')
print("DB Path:", db_path)

try:
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute('SELECT id, name, email, role FROM users WHERE email="testbot@citypulse.gov"')
    print('DB Record:', cur.fetchone())
    conn.close()
except Exception as e:
    print("DB Check Failed:", e)
