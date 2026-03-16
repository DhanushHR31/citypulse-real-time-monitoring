import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os
from datetime import datetime

MODEL_PATH = "backend/event_severity_model.pkl"
LE_TYPE_PATH = "backend/le_event_type.pkl"
LE_SEV_PATH = "backend/le_severity.pkl"

def train_model():
    """
    Trains a Random Forest model on synthetic data.
    """
    if not os.path.exists("backend/synthetic_events.csv"):
        print("Data not found. Please run generate_data.py first.")
        return

    df = pd.read_csv("backend/synthetic_events.csv")
    
    # Encoders
    le_type = LabelEncoder()
    le_sev = LabelEncoder()
    
    df['event_type_code'] = le_type.fit_transform(df['event_type'])
    df['severity_code'] = le_sev.fit_transform(df['severity'])
    
    X = df[['hour', 'day_of_week', 'event_type_code']]
    y = df['severity_code']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Save artifacts
    joblib.dump(model, MODEL_PATH)
    joblib.dump(le_type, LE_TYPE_PATH)
    joblib.dump(le_sev, LE_SEV_PATH)
    
    print(f"Model trained. Accuracy: {model.score(X_test, y_test):.2f}")

def predict_event_severity(event_type: str, timestamp: datetime):
    """
    Predicts severity for a given event type and time.
    """
    try:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError("Model not trained")
            
        model = joblib.load(MODEL_PATH)
        le_type = joblib.load(LE_TYPE_PATH)
        le_sev = joblib.load(LE_SEV_PATH)
        
        type_code = le_type.transform([event_type])[0]
        prediction_code = model.predict([[hour, day, type_code]])
        severity = le_sev.inverse_transform(prediction_code)[0]
        probs = model.predict_proba([[hour, day, type_code]])
        confidence = np.max(probs)
        
        return {"severity": severity, "confidence": float(confidence), "method": "ML Model"}
        
    except Exception as e:
        # Fallback Rule-Based Logic (Demo Resilience)
        # Rush Hours: 8-10 AM, 5-8 PM
        is_rush_hour = 8 <= hour <= 10 or 17 <= hour <= 20
        is_weekend = day >= 5
        
        severity = "Low"
        confidence = 0.6
        
        if event_type.lower() in ["traffic", "accident"]:
            if is_rush_hour and not is_weekend:
                severity = "High"
                confidence = 0.85
            elif is_rush_hour:
                severity = "Medium"
                confidence = 0.7
                
        elif event_type.lower() == "protest":
            severity = "High"
            confidence = 0.9

        return {
            "severity": severity, 
            "confidence": confidence, 
            "method": "Rule-Based (Fallback)",
            "note": "ML model not active, using heuristics."
        }
