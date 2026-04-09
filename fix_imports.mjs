import fs from 'fs';
import path from 'path';

const compDir = 'c:/Users/dhanu/OneDrive/Desktop/8Th sem/city/react-ui/src/components';
const files = fs.readdirSync(compDir);

const fullImport = "import { BANGALORE, ZONE_COLOR, SEV_COLOR, EVENTS, ALERTS, SOCIAL_POSTS, ZONE_STATS, NAV, EVENT_TYPES, RANGES, ZONES } from '../data/mockData';";

files.forEach(file => {
    if (file.endsWith('.jsx') && file !== 'shared.jsx') {
        const filePath = path.join(compDir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        
        // The original broken import from my generator script
        const badImport = "import { EVENT_TYPES, ZONE_STATS, SOCIAL_POSTS, ALERTS } from '../data/mockData';";
        
        if (content.includes(badImport)) {
            content = content.replace(badImport, fullImport);
            fs.writeFileSync(filePath, content);
            console.log('Fixed imports in', file);
        }
    }
});
