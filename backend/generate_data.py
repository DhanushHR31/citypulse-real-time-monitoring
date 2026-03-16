import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_synthetic_data(num_samples=1000):
    """
    Generates synthetic event data for training the prediction model.
    Features: hour, day_of_week, event_type_code
    Target: severity_code (0: Low, 1: Medium, 2: High, 3: Critical)
    """
    event_types = ['Traffic', 'Accident', 'Weather', 'Protest', 'Fire']
    severities = ['Low', 'Medium', 'High', 'Critical']
    
    data = []
    
    for _ in range(num_samples):
        date = datetime(2025, 1, 1) + timedelta(days=random.randint(0, 365), hours=random.randint(0, 23))
        event_type = random.choice(event_types)
        
        # Logic to make data somewhat realistic
        if event_type == 'Traffic':
            if 8 <= date.hour <= 10 or 17 <= date.hour <= 20: # Rush hour
                severity = np.random.choice(severities, p=[0.1, 0.3, 0.4, 0.2])
            else:
                severity = np.random.choice(severities, p=[0.6, 0.3, 0.1, 0.0])
        elif event_type == 'Accident':
            severity = np.random.choice(severities, p=[0.1, 0.4, 0.4, 0.1])
        elif event_type == 'Weather':
             # Rainy months
            if 6 <= date.month <= 9:
                 severity = np.random.choice(severities, p=[0.2, 0.3, 0.3, 0.2])
            else:
                 severity = 'Low'
        else:
            severity = np.random.choice(severities)

        data.append({
            'timestamp': date,
            'hour': date.hour,
            'day_of_week': date.weekday(),
            'event_type': event_type,
            'severity': severity
        })
        
    df = pd.DataFrame(data)
    return df

if __name__ == "__main__":
    df = generate_synthetic_data()
    df.to_csv("backend/synthetic_events.csv", index=False)
    print("Synthetic data generated: backend/synthetic_events.csv")
