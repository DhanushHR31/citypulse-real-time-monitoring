import re
import os

app_path = r"c:\Users\dhanu\OneDrive\Desktop\8Th sem\city\react-ui\src\App.jsx"
comp_dir = r"c:\Users\dhanu\OneDrive\Desktop\8Th sem\city\react-ui\src\components"

os.makedirs(comp_dir, exist_ok=True)

with open(app_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

def extract_comp(start_keyword, comp_name):
    start_idx = -1
    for i, line in enumerate(lines):
        if line.startswith(f"{start_keyword} {comp_name}("):
            start_idx = i
            break
    if start_idx == -1: return None
    
    # count braces
    open_b = 0
    end_idx = start_idx
    started = False
    
    for i in range(start_idx, len(lines)):
        open_b += lines[i].count('{')
        open_b -= lines[i].count('}')
        if lines[i].count('{') > 0:
            started = True
            
        if started and open_b == 0:
            end_idx = i
            break
            
    code = "".join(lines[start_idx:end_idx+1])
    
    # modify original lines to remove this
    for _ in range(end_idx - start_idx + 1):
        del lines[start_idx]
        
    return code

components = [
    ("function", "Dashboard"),
    ("function", "Navigation"),
    ("function", "NearbyEvents"),
    ("function", "SocialMonitor"),
    ("function", "ReportCenter"),
    ("function", "CityOverview"),
    ("function", "MyReports"),
    ("function", "SafetyAlerts"),
    ("function", "Analytics"),
    ("function", "ApiDocs"),
    ("function", "Profile")
]

extracted = []
for kw, name in components:
    code = extract_comp(kw, name)
    if code:
        file_content = "import React, { useState } from 'react';\n"
        file_content += "import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';\n"
        file_content += "import { LiveMap, Bdg } from './shared';\n"
        file_content += "import { EVENT_TYPES, ZONE_STATS, SOCIAL_POSTS, ALERTS } from '../data/mockData';\n\n"
        file_content += "export default " + code
        
        with open(f"{comp_dir}\\{name}.jsx", "w", encoding="utf-8") as out:
            out.write(file_content)
        extracted.append(name)

# add imports to top of App.jsx
import_stmts = "\n".join([f"import {name} from './components/{name}';" for name in extracted])
lines.insert(8, import_stmts + "\n")

with open(app_path, "w", encoding="utf-8") as f:
    f.writelines(lines)

print("Successfully refactored components:", extracted)
