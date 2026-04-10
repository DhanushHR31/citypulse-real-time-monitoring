import random
from datetime import datetime

# Represents a 50-item deep intelligence payload from the simulated Gemini sweep
# covering all 10 Urban Intelligence categories.
AI_INCIDENTS_PAYLOAD = [
    {"title": "Multi-vehicle collision on Outer Ring Road", "desc": "A 4-car pile-up has blocked the right lane near Bellandur. Heavy traffic forming.", "type": "Multi-vehicle collision", "sev": "High", "loc": "Bellandur ORR", "lat": 12.9261, "lng": 77.6760, "symbol": "🚗💥"},
    {"title": "Commercial Building Fire", "desc": "Fire reported in a 3-story commercial complex. Fire brigade on scene.", "type": "Fire accident", "sev": "Critical", "loc": "Commercial Street", "lat": 12.9822, "lng": 77.6083, "symbol": "🔥"},
    {"title": "Gas Leak in Peenya Industrial Area", "desc": "Strong smell of chemical gas reported. Surrounding 500m area evacuated.", "type": "Gas leak", "sev": "Critical", "loc": "Peenya", "lat": 13.0284, "lng": 77.5190, "symbol": "☣️"},
    {"title": "Tree Fall blocking 100ft road", "desc": "Large gulmohar tree fell due to strong winds, completely blocking Indiranagar 100ft road.", "type": "Tree fall on road", "sev": "High", "loc": "Indiranagar", "lat": 12.9784, "lng": 77.6408, "symbol": "🌲"},
    {"title": "Ambulance Stuck in Traffic", "desc": "Live organ transport ambulance delayed due to major congestion at Silk Board.", "type": "Ambulance delay", "sev": "Critical", "loc": "Silk Board Junction", "lat": 12.9177, "lng": 77.6228, "symbol": "🏥🚑"},
    
    {"title": "Waterlogging at K.R. Puram Underpass", "desc": "Sudden heavy rainfall has submerged the K.R. Puram underpass. Vehicles stalled.", "type": "Waterlogging", "sev": "High", "loc": "K.R. Puram", "lat": 13.0076, "lng": 77.6936, "symbol": "💧"},
    {"title": "Severe Heatwave Alert", "desc": "Temperatures crossing 38C today. Avoid outdoor activities between 12 PM - 4 PM.", "type": "Heatwave alert", "sev": "Medium", "loc": "Bengaluru South", "lat": 12.9063, "lng": 77.5857, "symbol": "🌡️"},
    {"title": "Flash Flooding in Varthur", "desc": "Varthur lake overflowing onto main roads. Two-wheelers advised to take alternate routes.", "type": "Flooding", "sev": "Critical", "loc": "Varthur", "lat": 12.9393, "lng": 77.7506, "symbol": "🌊"},
    {"title": "Lightning Strike Damages Transformer", "desc": "Lightning strike has caused a major BESCOM transformer to explode. Power cut in area.", "type": "Power cut", "sev": "Medium", "loc": "HSR Layout", "lat": 12.9121, "lng": 77.6446, "symbol": "🔌"},
    
    {"title": "Pothole Causing Accidents", "desc": "A massive uncovered pothole has caused 3 two-wheeler accidents since morning.", "type": "Potholes issue", "sev": "Medium", "loc": "Mysuru Road", "lat": 12.9537, "lng": 77.5424, "symbol": "🕳️"},
    {"title": "Drinking Water Shortage", "desc": "Pipeline maintenance has halted water supply for 24 hours in Jayanagar 4th Block.", "type": "No water supply", "sev": "Medium", "loc": "Jayanagar", "lat": 12.9250, "lng": 77.5938, "symbol": "🚰❌"},
    {"title": "Garbage Collectors Strike", "desc": "BBMP pourakarmikas protest over wage delays. Garbage piling up in residential areas.", "type": "Garbage strike", "sev": "Medium", "loc": "Shivajinagar", "lat": 12.9840, "lng": 77.5960, "symbol": "🗑️✊"},
    {"title": "Main Pipeline Burst", "desc": "Cauvery water pipeline has burst, wasting thousands of liters and flooding the area.", "type": "Pipeline damage", "sev": "High", "loc": "Banashankari", "lat": 12.9250, "lng": 77.5492, "symbol": "💧🛠️"},
    
    {"title": "Political Rally - 10,000+ Attendees", "desc": "Major political leader holding rally. Expect extreme traffic restrictions.", "type": "Political rally", "sev": "High", "loc": "Freedom Park", "lat": 12.9737, "lng": 77.5782, "symbol": "📢"},
    {"title": "Ugadi Festival Celebration", "desc": "Massive religious gathering blocking temple roads. Slow moving traffic.", "type": "Festival celebration", "sev": "Low", "loc": "Malleswaram", "lat": 13.0031, "lng": 77.5692, "symbol": "🎉"},
    {"title": "College Fest Extravaganza", "desc": "Cultural fest drawing large student crowds. Parking full, spillover onto streets.", "type": "College fest", "sev": "Low", "loc": "Koramangala", "lat": 12.9352, "lng": 77.6269, "symbol": "🎓"},
    
    {"title": "Metro Purple Line Delay", "desc": "Technical glitch at MG Road station causing 20-minute delays across Purple Line.", "type": "Metro delay", "sev": "High", "loc": "MG Road Station", "lat": 12.9752, "lng": 77.6091, "symbol": "🚇"},
    {"title": "BMTC Volvo Breakdown", "desc": "Airport-bound bus broke down on Hebbal flyover blocking the middle lane.", "type": "Bus breakdown", "sev": "Medium", "loc": "Hebbal Flyover", "lat": 13.0359, "lng": 77.5970, "symbol": "🚌🏚️"},
    {"title": "Cab Shortage / Surge Pricing", "desc": "Due to driver strike, cab availability is down 80%. Ola/Uber surge pricing at 3x.", "type": "Cab shortage", "sev": "Medium", "loc": "Bengaluru Airport", "lat": 13.1989, "lng": 77.7068, "symbol": "🚕❌"},
    
    {"title": "Elevated Flyover Crack Alert", "desc": "Commuters reported a visible structural crack on the Electronic City elevated tollway.", "type": "Flyover crack", "sev": "Critical", "loc": "Electronic City Toll", "lat": 12.8454, "lng": 77.6600, "symbol": "🌉📉"},
    {"title": "Under-construction Building Unsafe", "desc": "Scaffolding collapsed near a pedestrian walkway. BBMP ordered work stop.", "type": "Construction hazard", "sev": "High", "loc": "Whitefield", "lat": 12.9698, "lng": 77.7499, "symbol": "🏗️⚠️"},
    
    {"title": "Stampede Risk at Shopping Mall", "desc": "Weekend sale has caused dangerous overcrowding at entry gates. Police deployed.", "type": "Mall overcrowding", "sev": "High", "loc": "Phoenix Marketcity", "lat": 12.9956, "lng": 77.6966, "symbol": "🏬"},
    {"title": "Panic Situation over Loud Noise", "desc": "A sonic boom or transformer blast caused brief panic among residents.", "type": "Panic situation", "sev": "Medium", "loc": "CV Raman Nagar", "lat": 12.9851, "lng": 77.6512, "symbol": "😨"},
    
    {"title": "Riot Control Situation", "desc": "Two groups clashing over a local dispute. Rapid Action Force deployed.", "type": "Riot situation", "sev": "Critical", "loc": "DJ Halli", "lat": 13.0189, "lng": 77.6200, "symbol": "🧨"},
    {"title": "Chain Snatching Incident", "desc": "Two men on a bike assaulted a pedestrian and stole jewelry in broad daylight.", "type": "Robbery", "sev": "High", "loc": "JPMorgan Outer Ring Road", "lat": 12.9352, "lng": 77.6834, "symbol": "💰"},
    {"title": "Police Checkpoint Setup", "desc": "Drunken driving checks starting early. Traffic funneled into single lane.", "type": "Checkpoint setup", "sev": "Low", "loc": "Cunningham Road", "lat": 12.9830, "lng": 77.5940, "symbol": "🚧👮"},
    
    {"title": "Hospital Overcrowding", "desc": "Victoria Hospital reporting full ICU beds due to sudden spike in viral fever cases.", "type": "Hospital overcrowding", "sev": "High", "loc": "K.R. Market", "lat": 12.9602, "lng": 77.5735, "symbol": "🏥🏥"},
    {"title": "Hit and Run Pedestrian", "desc": "Speeding SUV hit a senior citizen crossing the road and fled.", "type": "Hit and run case", "sev": "Critical", "loc": "BTM Layout", "lat": 12.9165, "lng": 77.6101, "symbol": "🏎️💨"},
    {"title": "VIP Movement Halt", "desc": "Chief Minister convoy passing through. All traffic stopped for 15 minutes.", "type": "VIP movement traffic halt", "sev": "Medium", "loc": "Race Course Road", "lat": 12.9822, "lng": 77.5815, "symbol": "🤴🚦"},
    {"title": "Drainage Overflow Foul Odour", "desc": "Broken sewage line has flooded the entire 8th cross layout with wastewater.", "type": "Drainage overflow", "sev": "Medium", "loc": "Rajajinagar", "lat": 12.9921, "lng": 77.5510, "symbol": "🚽"},
    
    {"title": "Bridge Structural Damage", "desc": "Reports of minor structural damage on the KR Puram hanging bridge.", "type": "Bridge damage", "sev": "Critical", "loc": "KR Puram", "lat": 13.0076, "lng": 77.6936, "symbol": "🌉🏚️"},
    {"title": "Traffic Signal Failure", "desc": "Major signal failure at Sony World junction causing gridlock.", "type": "Signal failure", "sev": "High", "loc": "Koramangala", "lat": 12.9352, "lng": 77.6269, "symbol": "🚦❌"},
    {"title": "Illegal Parking Jam", "desc": "Dozens of illegally parked cars blocking the narrow lanes of Brigade Road.", "type": "Illegal parking issue", "sev": "Medium", "loc": "Brigade Road", "lat": 12.9724, "lng": 77.6075, "symbol": "🚫🅿️"},
    {"title": "Storm Warning Issued", "desc": "Meteorological department warns of incoming heavy thunderstorms within 2 hrs.", "type": "Storm warning", "sev": "Medium", "loc": "Bengaluru General", "lat": 12.9716, "lng": 77.5946, "symbol": "⛈️"},
    {"title": "Streetlight Failure in Layout", "desc": "Entire block in HSR Layout Sector 1 is completely dark due to streetlight outage.", "type": "Streetlight failure", "sev": "Medium", "loc": "HSR Layout Sector 1", "lat": 12.9121, "lng": 77.6446, "symbol": "🌑"},
    {"title": "Marathon Event Road Closure", "desc": "City marathon event in progress. Inner ring roads completely closed to traffic.", "type": "Marathon event", "sev": "High", "loc": "Cubbon Park", "lat": 12.9779, "lng": 77.5952, "symbol": "🏃"},
    {"title": "Security Alert - Bag Found", "desc": "Unattended bag found near Majestic bus stand. Bomb squad inspecting.", "type": "Security alert", "sev": "Critical", "loc": "Majestic", "lat": 12.9766, "lng": 77.5713, "symbol": "🚨"},
    {"title": "Flight Delay Impacting Traffic", "desc": "Multiple delayed flights causing a surge of cabs leaving the airport simultaneously.", "type": "Flight delay impact", "sev": "Medium", "loc": "Kempegowda Int. Airport", "lat": 13.1989, "lng": 77.7068, "symbol": "🛫⏳"},
    {"title": "Medical Emergency at Station", "desc": "Passenger suffered a suspected heart attack. Waiting for emergency responders.", "type": "Medical emergency", "sev": "High", "loc": "Yeshwantpur Railway Station", "lat": 13.0232, "lng": 77.5492, "symbol": "🚑"},
    
    # +10 MORE FOR FULL 50 INCIDENT PAYLOAD
    {"title": "Protest Outside Town Hall", "desc": "Citizen organization protesting civic apathy. Expect slow traffic for 3 hours.", "type": "Protest", "sev": "Medium", "loc": "Town Hall", "lat": 12.9654, "lng": 77.5861, "symbol": "✊"},
    {"title": "Electric Pole Collapse", "desc": "Heavy winds brought down a major electric pole, crushing two parked bikes.", "type": "Electric pole damage", "sev": "High", "loc": "Basavanagudi", "lat": 12.9406, "lng": 77.5738, "symbol": "⚡🪵"},
    {"title": "Disease Outbreak Alert - Dengue", "desc": "BBMP Health officials declaring high alert for dengue clusters in specific wards.", "type": "Disease outbreak alert", "sev": "High", "loc": "Mahadevapura", "lat": 12.9880, "lng": 77.6895, "symbol": "🦠"},
    {"title": "Massive Toll Congestion", "desc": "FasTag server outage leading to 2km long queues at the toll plaza.", "type": "Toll congestion", "sev": "Medium", "loc": "Nelamangala Toll", "lat": 13.0970, "lng": 77.3940, "symbol": "🛣️"},
    {"title": "Building Collapse (Abandoned)", "desc": "An old, abandoned 2-story building collapsed after heavy rain. No injuries.", "type": "Building collapse", "sev": "High", "loc": "Chickpet", "lat": 12.9699, "lng": 77.5760, "symbol": "🏚️"},
    {"title": "Train Derailment Shock", "desc": "A goods train derailed causing cancellations of multiple domestic passenger lines.", "type": "Train delay", "sev": "Critical", "loc": "Krantivira Sangolli Rayanna (KSR)", "lat": 12.9774, "lng": 77.5721, "symbol": "🚂⚠️"},
    {"title": "Chemical Spill on Highway", "desc": "Truck leaking slippery industrial chemical. Avoid leftmost lane for 5km.", "type": "Chemical leak", "sev": "Critical", "loc": "Tumkur Road", "lat": 13.0334, "lng": 77.5251, "symbol": "🧪"},
    {"title": "Cultural Fair Roadblocks", "desc": "Annual fair taking place. All heavy vehicle entry banned in immediate zones.", "type": "Cultural event", "sev": "Low", "loc": "Lalbagh Botanical Garden", "lat": 12.9507, "lng": 77.5848, "symbol": "🎨"},
    {"title": "Road Digging Delays", "desc": "Unannounced road digging by ISP cable layers creating a massive bottleneck.", "type": "Road digging", "sev": "Medium", "loc": "Sarjapur Road", "lat": 12.9234, "lng": 77.6741, "symbol": "⛏️"},
    {"title": "Drowning Incident at Lake", "desc": "Search teams deployed to locate a missing teen reported at Madiwala Lake.", "type": "Drowning incident", "sev": "Critical", "loc": "Madiwala Lake", "lat": 12.9118, "lng": 77.6190, "symbol": "🌊🚨"}
]

def generate_live_reports_payload(count=50):
    # Returns the exact realistic data compiled to mirror AI outputs
    return AI_INCIDENTS_PAYLOAD[:count]
