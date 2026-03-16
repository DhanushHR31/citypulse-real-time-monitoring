from services import gemini
from dotenv import load_dotenv
import os

load_dotenv()

text = "Heavy traffic pileup on MG Road due to broken signal."
print(f"Testing Analysis for: {text}")
result = gemini.analyze_event_text(text)
print("Result:")
print(result)
