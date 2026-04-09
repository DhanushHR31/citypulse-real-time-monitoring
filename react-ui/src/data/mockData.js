export const BANGALORE = [12.9716, 77.5946];

export const ZONE_COLOR = {
  Central: '#60a5fa', North: '#4ade80', South: '#facc15',
  East: '#f87171', West: '#fb923c', 'IT/Tech': '#a78bfa',
  Industrial: '#94a3b8', Peripheral: '#64748b',
};

export const SEV_COLOR = { critical: '#ef4444', high: '#ef4444', medium: '#f97316', low: '#22c55e' };

export const EVENT_TYPE_META = {
  'Road Accident':      { icon: '🚗💥', cat: 'Emergency', color: '#ef4444' },
  'Fire Accident':      { icon: '🔥',   cat: 'Emergency', color: '#ef4444' },
  'Building Collapse':  { icon: '🏚️',  cat: 'Emergency', color: '#ef4444' },
  'Gas Leak':           { icon: '☣️',   cat: 'Emergency', color: '#ef4444' },
  'Medical Emergency':  { icon: '🚑',   cat: 'Emergency', color: '#ef4444' },
  'Explosion':          { icon: '💥',   cat: 'Emergency', color: '#ef4444' },
  'Landslide':          { icon: '🪨',   cat: 'Emergency', color: '#ef4444' },
  'Electrocution':      { icon: '⚡',   cat: 'Emergency', color: '#ef4444' },
  'Traffic Congestion': { icon: '🚦',   cat: 'Traffic',   color: '#f97316' },
  'Road Block':         { icon: '⛔',   cat: 'Traffic',   color: '#f97316' },
  'Flyover Closure':    { icon: '🌉',   cat: 'Traffic',   color: '#f97316' },
  'Metro Delay':        { icon: '🚇',   cat: 'Traffic',   color: '#f97316' },
  'Signal Failure':     { icon: '🚥',   cat: 'Traffic',   color: '#f97316' },
  'Vehicle Breakdown':  { icon: '🚘',   cat: 'Traffic',   color: '#f97316' },
  'Heavy Rain':         { icon: '🌧️',  cat: 'Weather',   color: '#38bdf8' },
  'Flooding':           { icon: '🌊',   cat: 'Weather',   color: '#38bdf8' },
  'Waterlogging':       { icon: '💧',   cat: 'Weather',   color: '#38bdf8' },
  'Storm':              { icon: '⛈️',  cat: 'Weather',   color: '#38bdf8' },
  'Heatwave':           { icon: '🌡️',  cat: 'Weather',   color: '#f59e0b' },
  'Cyclone Alert':      { icon: '🌀',   cat: 'Weather',   color: '#38bdf8' },
  'Water Shortage':     { icon: '🚱',   cat: 'Civic',     color: '#a78bfa' },
  'Power Cut':          { icon: '🔌',   cat: 'Civic',     color: '#a78bfa' },
  'Road Repair':        { icon: '🛠️',  cat: 'Civic',     color: '#a78bfa' },
  'Drainage Overflow':  { icon: '🚽',   cat: 'Civic',     color: '#a78bfa' },
  'BBMP Maintenance':   { icon: '🏗️',  cat: 'Civic',     color: '#a78bfa' },
  'Garbage Strike':     { icon: '🗑️',  cat: 'Civic',     color: '#a78bfa' },
  'Festival':           { icon: '🎉',   cat: 'Public',    color: '#22c55e' },
  'Religious Gathering':{ icon: '🛕',   cat: 'Public',    color: '#22c55e' },
  'Political Rally':    { icon: '📢',   cat: 'Public',    color: '#22c55e' },
  'Protest':            { icon: '✊',   cat: 'Public',    color: '#22c55e' },
  'Marathon':           { icon: '🏃',   cat: 'Public',    color: '#22c55e' },
  'Concert':            { icon: '🎶',   cat: 'Public',    color: '#22c55e' },
  'High Crowd Density': { icon: '👥',   cat: 'Crowd',     color: '#f59e0b' },
  'Stampede Risk':      { icon: '⚠️',   cat: 'Crowd',     color: '#ef4444' },
  'Overcrowded Mall':   { icon: '🏬',   cat: 'Crowd',     color: '#f59e0b' },
  'Queue Congestion':   { icon: '🧍',   cat: 'Crowd',     color: '#f59e0b' },
  'Other':              { icon: '📍',   cat: 'Other',     color: '#64748b' },
};

export const EVENT_CATEGORIES = ['All', 'Emergency', 'Traffic', 'Weather', 'Civic', 'Public', 'Crowd'];

// ── 100+ Incidents across all Bengaluru zones ──
export const EVENTS = [
  // ── CENTRAL BENGALURU ──
  { id:1,  title:'Multi-vehicle crash on MG Road',       loc:'MG Road',          zone:'Central',    sev:'high',     type:'Road Accident',      lat:12.9752, lng:77.6091, time:'5m ago',  icon:'🚗💥', desc:'3-car pile-up near Trinity Circle. Police deployed.',              source:'Twitter' },
  { id:2,  title:'Metro signal failure – Majestic',      loc:'Majestic Station', zone:'Central',    sev:'medium',   type:'Metro Delay',        lat:12.9772, lng:77.5707, time:'12m ago', icon:'🚇',   desc:'Purple Line halted. 20-min delays expected. Use buses.',           source:'BMTC Feed' },
  { id:3,  title:'Festival crowd – Cubbon Park',         loc:'Cubbon Park',      zone:'Central',    sev:'low',      type:'Festival',           lat:12.9796, lng:77.5909, time:'20m ago', icon:'🎉',   desc:'Ugadi celebrations. 10k+ attendees. Light traffic nearby.',        source:'Instagram' },
  { id:4,  title:'Power cut – Shivajinagar',             loc:'Shivajinagar',     zone:'Central',    sev:'medium',   type:'Power Cut',          lat:12.9840, lng:77.5960, time:'35m ago', icon:'🔌',   desc:'BESCOM scheduled maintenance. 4-6h outage zone.',                 source:'BESCOM App' },
  { id:5,  title:'Political rally – Freedom Park',       loc:'Freedom Park',     zone:'Central',    sev:'medium',   type:'Political Rally',    lat:12.9737, lng:77.5782, time:'1h ago',  icon:'📢',   desc:'Party rally, 5k attendees. Roads partially closed.',               source:'Twitter' },
  { id:6,  title:'Road blocked – Brigade Road',          loc:'Brigade Road',     zone:'Central',    sev:'medium',   type:'Road Block',         lat:12.9716, lng:77.6076, time:'45m ago', icon:'⛔',   desc:'VIP convoy blocked main road. Allow 30-min detour.',              source:'Twitter' },
  { id:7,  title:'Concert at UB City',                   loc:'UB City Mall',     zone:'Central',    sev:'low',      type:'Concert',            lat:12.9724, lng:77.5962, time:'2h ago',  icon:'🎶',   desc:'Live music event draws 3k attendees. Parking unavailable.',        source:'Facebook' },
  { id:8,  title:'Drainage overflow – Vasanth Nagar',   loc:'Vasanth Nagar',    zone:'Central',    sev:'medium',   type:'Drainage Overflow',  lat:12.9935, lng:77.5875, time:'55m ago', icon:'🚽',   desc:'Drainage blocked. Sewage overflowing onto Infantry Road.',         source:'Facebook' },
  { id:9,  title:'High crowd density – Majestic',       loc:'Majestic Bus Stand',zone:'Central',   sev:'medium',   type:'High Crowd Density', lat:12.9768, lng:77.5720, time:'30m ago', icon:'👥',   desc:'Weekend bus rush. Overcrowded terminus. Entry restricted.',        source:'BMTC Feed' },
  { id:10, title:'Gas pipe maintenance – Richmond Town', loc:'Richmond Town',    zone:'Central',    sev:'low',      type:'BBMP Maintenance',   lat:12.9619, lng:77.5996, time:'3h ago',  icon:'🏗️',  desc:'Gas pipeline inspection. Road partially closed.',                 source:'BBMP Feed' },
  { id:11, title:'Signal failure – Lavelle Road',        loc:'Lavelle Road',     zone:'Central',    sev:'low',      type:'Signal Failure',     lat:12.9700, lng:77.5940, time:'1h ago',  icon:'🚥',   desc:'Traffic light outage. Manual police control on duty.',             source:'Twitter' },
  { id:12, title:'Marathon – Kasturba Road',             loc:'Kasturba Road',    zone:'Central',    sev:'low',      type:'Marathon',           lat:12.9735, lng:77.5863, time:'4h ago',  icon:'🏃',   desc:'Bengaluru 10K run. Roads closed 6-10AM.',                         source:'Facebook' },

  // ── NORTH BENGALURU ──
  { id:13, title:'Flyover closed – Hebbal',              loc:'Hebbal Flyover',   zone:'North',      sev:'high',     type:'Flyover Closure',    lat:13.0359, lng:77.5970, time:'2h ago',  icon:'🌉',   desc:'Structural inspection. Full closure till 6PM. Heavy diversion.',  source:'BBMP Feed' },
  { id:14, title:'Factory fire – Peenya Industrial',     loc:'Peenya Industrial',zone:'North',      sev:'critical', type:'Fire Accident',      lat:13.0284, lng:77.5170, time:'7m ago',  icon:'🔥',   desc:'Chemical factory fire. Toxic fumes reported. 1km evacuation.',   source:'Google News' },
  { id:15, title:'Traffic jam – RT Nagar junction',      loc:'RT Nagar',         zone:'North',      sev:'medium',   type:'Traffic Congestion', lat:13.0211, lng:77.5882, time:'25m ago', icon:'🚦',   desc:'Signal failure causes 45-min backup.',                            source:'Twitter' },
  { id:16, title:'Power outage – Yelahanka',             loc:'Yelahanka',        zone:'North',      sev:'medium',   type:'Power Cut',          lat:13.1007, lng:77.5963, time:'1h ago',  icon:'🔌',   desc:'BESCOM feeder fault. 3000 homes affected. Repair in 2h.',         source:'BESCOM App' },
  { id:17, title:'Road repair – Thanisandra main road',  loc:'Thanisandra',      zone:'North',      sev:'low',      type:'Road Repair',        lat:13.0595, lng:77.6170, time:'6h ago',  icon:'🛠️',  desc:'BBMP pothole resurfacing. Narrow road – allow extra time.',       source:'BBMP Feed' },
  { id:18, title:'Water shortage – Sahakar Nagar',       loc:'Sahakar Nagar',    zone:'North',      sev:'medium',   type:'Water Shortage',     lat:13.0504, lng:77.5943, time:'4h ago',  icon:'🚱',   desc:'BWSSB pipeline burst. Tankers dispatched, 3h delay.',             source:'BWSSB App' },
  { id:19, title:'Religious gathering – Jakkur',         loc:'Jakkur Lake',      zone:'North',      sev:'low',      type:'Religious Gathering', lat:13.0740, lng:77.5990, time:'2h ago', icon:'🛕',   desc:'Annual temple festival. 8k devotees. Parking overflow.',          source:'Instagram' },
  { id:20, title:'Vehicle breakdown – Airport Road',     loc:'Airport Road',     zone:'North',      sev:'medium',   type:'Vehicle Breakdown',  lat:13.1989, lng:77.7068, time:'40m ago', icon:'🚘',   desc:'Bus breakdown blocks left lane. KSRTC repair team en-route.',     source:'Twitter' },
  { id:21, title:'Protest – Devanahalli highway',        loc:'Devanahalli',      zone:'North',      sev:'medium',   type:'Protest',            lat:13.2468, lng:77.7108, time:'50m ago', icon:'✊',   desc:'Farmer protest on NH-7. Partial highway blockade.',              source:'Twitter' },
  { id:22, title:'Stampede risk – Hennur market',        loc:'Hennur',           zone:'North',      sev:'high',     type:'Stampede Risk',      lat:13.0522, lng:77.6298, time:'22m ago', icon:'⚠️',   desc:'Festival rush at market. Crowd control deployed.',                source:'Facebook' },
  { id:23, title:'Signal failure – Vidyaranyapura',      loc:'Vidyaranyapura',   zone:'North',      sev:'low',      type:'Signal Failure',     lat:13.0569, lng:77.5522, time:'1.5h ago',icon:'🚥',   desc:'3 signals down. Police managing manually.',                       source:'Twitter' },
  { id:24, title:'Road block – Manyata Tech Park',       loc:'Manyata Tech Park',zone:'North',      sev:'medium',   type:'Road Block',         lat:13.0480, lng:77.6187, time:'30m ago', icon:'⛔',   desc:'IT park event causes bottleneck on Outer Ring Road.',             source:'Twitter' },

  // ── SOUTH BENGALURU ──
  { id:25, title:'Flash flood – Bellandur Lake',         loc:'Bellandur',        zone:'South',      sev:'critical', type:'Flooding',           lat:12.9261, lng:77.6760, time:'5m ago',  icon:'🌊',   desc:'Lake overflowing. 3 roads submerged. NDRF deployed.',            source:'Twitter' },
  { id:26, title:'Traffic jam – Silk Board Junction',    loc:'Silk Board',       zone:'South',      sev:'high',     type:'Traffic Congestion', lat:12.9177, lng:77.6228, time:'10m ago', icon:'🚦',   desc:'60+ min delays. Alternate: Hosur Rd flyover.',                   source:'Twitter' },
  { id:27, title:'Waterlogging – Koramangala 6th Block', loc:'Koramangala',      zone:'South',      sev:'medium',   type:'Waterlogging',       lat:12.9352, lng:77.6269, time:'25m ago', icon:'💧',   desc:'Storm drains overflowing. 2 streets blocked.',                   source:'Instagram' },
  { id:28, title:'Stampede risk – Lalbagh Flower Show',  loc:'Lalbagh',          zone:'South',      sev:'high',     type:'Stampede Risk',      lat:12.9507, lng:77.5848, time:'40m ago', icon:'⚠️',   desc:'Overcrowded entry gates. Police managing exits.',                 source:'Instagram' },
  { id:29, title:'Electrocution – Basavanagudi',         loc:'Basavanagudi',     zone:'South',      sev:'critical', type:'Electrocution',      lat:12.9421, lng:77.5758, time:'15m ago', icon:'⚡',   desc:'Live wire on SVP Road. 1 injured. BESCOM alerted.',              source:'Twitter' },
  { id:30, title:'Road repair – BTM Layout',             loc:'BTM Layout',       zone:'South',      sev:'low',      type:'Road Repair',        lat:12.9165, lng:77.6101, time:'5h ago',  icon:'🛠️',  desc:'BBMP pothole work on Bannerghatta Road junction.',               source:'BBMP Feed' },
  { id:31, title:'Water shortage – Jayanagar',           loc:'Jayanagar 4th Block',zone:'South',    sev:'medium',   type:'Water Shortage',     lat:12.9250, lng:77.5938, time:'3h ago',  icon:'🚱',   desc:'Supply disrupted. Tankers provided. Restore by evening.',         source:'BWSSB App' },
  { id:32, title:'Festival – JP Nagar',                  loc:'JP Nagar',         zone:'South',      sev:'low',      type:'Festival',           lat:12.9063, lng:77.5857, time:'2h ago',  icon:'🎉',   desc:'Neighbourhood cultural fest. Roads busy.',                        source:'Facebook' },
  { id:33, title:'Garbage strike – Banashankari',        loc:'Banashankari',     zone:'South',      sev:'medium',   type:'Garbage Strike',     lat:12.9250, lng:77.5492, time:'8h ago',  icon:'🗑️',  desc:'BBMP workers strike. Garbage piling on streets.',                source:'Twitter' },
  { id:34, title:'Traffic – Bannerghatta Road',          loc:'Bannerghatta Road',zone:'South',      sev:'high',     type:'Traffic Congestion', lat:12.8630, lng:77.5970, time:'20m ago', icon:'🚦',   desc:'School traffic + accident. 50-min delay near NICE road.',        source:'Twitter' },
  { id:35, title:'Heatwave alert – City-wide',           loc:'Bengaluru South',  zone:'South',      sev:'medium',   type:'Heatwave',           lat:12.9063, lng:77.5857, time:'1h ago',  icon:'🌡️',  desc:'39°C forecast. Avoid outdoor activity 12-4PM.',                  source:'IMD India' },
  { id:36, title:'Power cut – Kumaraswamy Layout',       loc:'Kumaraswamy Layout',zone:'South',     sev:'medium',   type:'Power Cut',          lat:12.9006, lng:77.5516, time:'2h ago',  icon:'🔌',   desc:'Transformer fault. 6h outage. BESCOM working.',                  source:'BESCOM App' },
  { id:37, title:'Road block – Kanakapura Road',         loc:'Kanakapura Road',  zone:'South',      sev:'medium',   type:'Road Block',         lat:12.8914, lng:77.5596, time:'1h ago',  icon:'⛔',   desc:'BBMP digging work blocks one lane. Slow traffic.',               source:'BBMP Feed' },
  { id:38, title:'Religious gathering – Uttarahalli',    loc:'Uttarahalli',      zone:'South',      sev:'low',      type:'Religious Gathering', lat:12.8944, lng:77.5430, time:'3h ago', icon:'🛕',   desc:'Temple festival. Expect slow traffic in 2km radius.',            source:'Facebook' },

  // ── EAST BENGALURU ──
  { id:39, title:'Gas leak – Indiranagar 100ft Road',    loc:'Indiranagar',      zone:'East',       sev:'high',     type:'Gas Leak',           lat:12.9784, lng:77.6408, time:'18m ago', icon:'☣️',   desc:'LPG truck rupture. 500m radius evacuated.',                      source:'Facebook' },
  { id:40, title:'Flooding – Varthur Lake',              loc:'Varthur',          zone:'East',       sev:'critical', type:'Flooding',           lat:12.9393, lng:77.7506, time:'8m ago',  icon:'🌊',   desc:'Varthur lake breaching. 3 residential areas flooded.',           source:'Google News' },
  { id:41, title:'Road accident – Outer Ring Road',      loc:'Outer Ring Road',  zone:'East',       sev:'high',     type:'Road Accident',      lat:12.9352, lng:77.6834, time:'15m ago', icon:'🚗💥', desc:'Truck-car collision. 2 lanes blocked. 2km queue.',               source:'Twitter' },
  { id:42, title:'High crowd – Phoenix Mall Whitefield', loc:'Whitefield',       zone:'East',       sev:'medium',   type:'Overcrowded Mall',   lat:12.9956, lng:77.6966, time:'50m ago', icon:'🏬',   desc:'Weekend rush. Entry restricted at G floor.',                     source:'Instagram' },
  { id:43, title:'Medical emergency – Manipal Hospital', loc:'Manipal Whitefield',zone:'East',      sev:'high',     type:'Medical Emergency',  lat:12.9592, lng:77.7487, time:'22m ago', icon:'🚑',   desc:'Mass casualty incident. Trauma center activated.',               source:'Twitter' },
  { id:44, title:'Drainage overflow – Marathahalli',     loc:'Marathahalli',     zone:'East',       sev:'high',     type:'Drainage Overflow',  lat:12.9566, lng:77.7012, time:'30m ago', icon:'🚽',   desc:'Sewage overflow at bridge. E-way partially blocked.',            source:'Facebook' },
  { id:45, title:'Traffic – KR Puram junction',          loc:'KR Puram',         zone:'East',       sev:'medium',   type:'Traffic Congestion', lat:13.0076, lng:77.6936, time:'35m ago', icon:'🚦',   desc:'IT office peak hour congestion. 40-min delay.',                  source:'Twitter' },
  { id:46, title:'Building collapse – BTM Lake area',    loc:'Mahadevapura',     zone:'East',       sev:'critical', type:'Building Collapse',  lat:12.9947, lng:77.6887, time:'20m ago', icon:'🏚️',  desc:'Under-construction site partial collapse. 2 trapped.',           source:'Google News' },
  { id:47, title:'Waterlogging – HAL area',              loc:'HAL Airport Road', zone:'East',       sev:'medium',   type:'Waterlogging',       lat:12.9590, lng:77.6478, time:'1h ago',  icon:'💧',   desc:'HAL road submerged after heavy rain.',                           source:'Twitter' },
  { id:48, title:'Protest – CV Raman Nagar',             loc:'CV Raman Nagar',   zone:'East',       sev:'medium',   type:'Protest',            lat:12.9851, lng:77.6512, time:'2h ago',  icon:'✊',   desc:'Residents protest pothole repairs. Roads slow.',                 source:'Twitter' },
  { id:49, title:'Signal failure – Brookefield junction',loc:'Brookefield',      zone:'East',       sev:'low',      type:'Signal Failure',     lat:12.9744, lng:77.7190, time:'1h ago',  icon:'🚥',   desc:'3 signals offline. Police managing manually.',                   source:'Twitter' },
  { id:50, title:'Power cut – Bellandur',                loc:'Bellandur',        zone:'East',       sev:'medium',   type:'Power Cut',          lat:12.9261, lng:77.6760, time:'3h ago',  icon:'🔌',   desc:'Flooding damaged substation. 5000 homes without power.',         source:'BESCOM App' },
  { id:51, title:'Vehicle breakdown – Whitefield highway',loc:'Whitefield',      zone:'East',       sev:'low',      type:'Vehicle Breakdown',  lat:12.9698, lng:77.7499, time:'40m ago', icon:'🚘',   desc:'Truck stalled on left lane. Tow truck en-route.',                source:'Twitter' },

  // ── WEST BENGALURU ──
  { id:52, title:'Water shortage – Rajajinagar Block 6', loc:'Rajajinagar',      zone:'West',       sev:'medium',   type:'Water Shortage',     lat:12.9921, lng:77.5510, time:'3h ago',  icon:'🚱',   desc:'BWSSB pipeline burst. Tanker supply dispatched.',                source:'BWSSB App' },
  { id:53, title:'Road accident – Magadi Road',          loc:'Magadi Road',      zone:'West',       sev:'high',     type:'Road Accident',      lat:13.0054, lng:77.5335, time:'28m ago', icon:'🚗💥', desc:'Auto-truck collision near Bharath Circle. 2 injured.',           source:'Twitter' },
  { id:54, title:'BBMP maintenance – Malleshwaram',      loc:'Malleshwaram',     zone:'West',       sev:'low',      type:'BBMP Maintenance',   lat:13.0031, lng:77.5692, time:'5h ago',  icon:'🏗️',  desc:'Drain cleaning work. Road partially blocked. 6AM-12PM.',         source:'BBMP Feed' },
  { id:55, title:'Power cut – Vijayanagar',              loc:'Vijayanagar',      zone:'West',       sev:'medium',   type:'Power Cut',          lat:12.9714, lng:77.5301, time:'2h ago',  icon:'🔌',   desc:'Feeder fault in Vijayanagar. 2h repair estimate.',               source:'BESCOM App' },
  { id:56, title:'Waterlogging – Kengeri underpass',     loc:'Kengeri',          zone:'West',       sev:'high',     type:'Waterlogging',       lat:12.9138, lng:77.4822, time:'35m ago', icon:'💧',   desc:'Underpass flooded. 1m deep water. Avoid NICE road side.',        source:'Twitter' },
  { id:57, title:'Festival – Malleshwaram',              loc:'Malleshwaram 8th Cross',zone:'West',  sev:'low',      type:'Festival',           lat:13.0031, lng:77.5692, time:'2h ago',  icon:'🎉',   desc:'Annual cultural fest. Heavy pedestrian crowd.',                  source:'Instagram' },
  { id:58, title:'Traffic – Yeshwanthpur junction',      loc:'Yeshwanthpur',     zone:'West',       sev:'high',     type:'Traffic Congestion', lat:13.0268, lng:77.5507, time:'20m ago', icon:'🚦',   desc:'Truck overturned. National highway blocked. 90-min delay.',     source:'Twitter' },
  { id:59, title:'Road repair – Nagarbhavi main road',   loc:'Nagarbhavi',       zone:'West',       sev:'low',      type:'Road Repair',        lat:12.9519, lng:77.5090, time:'4h ago',  icon:'🛠️',  desc:'BBMP resurfacing work near Nagarbhavi Circle.',                  source:'BBMP Feed' },
  { id:60, title:'Protest – Dasarahalli',                loc:'Dasarahalli',      zone:'West',       sev:'medium',   type:'Protest',            lat:13.0494, lng:77.5108, time:'1h ago',  icon:'✊',   desc:'Auto drivers protest toll. Roads blocked 30 min.',              source:'Twitter' },
  { id:61, title:'Fire – Peenya warehouses',             loc:'Peenya',           zone:'West',       sev:'critical', type:'Fire Accident',      lat:13.0284, lng:77.5190, time:'14m ago', icon:'🔥',   desc:'Warehouse fire. Multiple fire engines deployed.',                source:'Google News' },

  // ── IT & TECH CORRIDORS ──
  { id:62, title:'Flooding – Electronic City Phase 2',   loc:'Electronic City',  zone:'IT/Tech',    sev:'high',     type:'Flooding',           lat:12.8454, lng:77.6602, time:'18m ago', icon:'🌊',   desc:'Underpass flooded. IT companies advising WFH.',                 source:'Twitter' },
  { id:63, title:'Traffic – HSR Layout 27th Main',       loc:'HSR Layout',       zone:'IT/Tech',    sev:'medium',   type:'Traffic Congestion', lat:12.9121, lng:77.6446, time:'30m ago', icon:'🚦',   desc:'Signal broken. 40-min queue from Agara Lake.',                  source:'Twitter' },
  { id:64, title:'Waterlogging – Sarjapur Road',         loc:'Sarjapur Road',    zone:'IT/Tech',    sev:'medium',   type:'Waterlogging',       lat:12.9060, lng:77.6872, time:'40m ago', icon:'💧',   desc:'Sarjapur-Marathahalli stretch flooded. IT commuters delayed.',  source:'Facebook' },
  { id:65, title:'Power cut – Domlur',                   loc:'Domlur',           zone:'IT/Tech',    sev:'medium',   type:'Power Cut',          lat:12.9614, lng:77.6303, time:'1h ago',  icon:'🔌',   desc:'Planned BESCOM maintenance. IT parks using generators.',         source:'BESCOM App' },
  { id:66, title:'High crowd – ORR Tech Park',           loc:'Outer Ring Road',  zone:'IT/Tech',    sev:'medium',   type:'High Crowd Density', lat:12.9352, lng:77.6834, time:'50m ago', icon:'👥',   desc:'Office-hour rush. 5000+ employees leaving simultaneously.',     source:'Twitter' },
  { id:67, title:'Road accident – Koramangala 5th block',loc:'Koramangala',      zone:'IT/Tech',    sev:'high',     type:'Road Accident',      lat:12.9352, lng:77.6269, time:'20m ago', icon:'🚗💥', desc:'Bike-car collision. 1 injured. Traffic backed up.',              source:'Twitter' },
  { id:68, title:'Drainage overflow – HSR Layout',       loc:'HSR Layout',       zone:'IT/Tech',    sev:'medium',   type:'Drainage Overflow',  lat:12.9121, lng:77.6446, time:'1h ago',  icon:'🚽',   desc:'Sewage in streets behind Agara lake. Foul smell.',              source:'Facebook' },
  { id:69, title:'Signal failure – Domlur flyover',      loc:'Domlur',           zone:'IT/Tech',    sev:'medium',   type:'Signal Failure',     lat:12.9614, lng:77.6303, time:'45m ago', icon:'🚥',   desc:'Power failure at 3 signals. Police deployed.',                  source:'Twitter' },
  { id:70, title:'Concert – Phoenix Mall Koramangala',   loc:'Koramangala',      zone:'IT/Tech',    sev:'low',      type:'Concert',            lat:12.9352, lng:77.6269, time:'3h ago',  icon:'🎶',   desc:'Indoor concert event. Mall parking overflowing.',               source:'Instagram' },
  { id:71, title:'Marathon – Outer Ring Road',           loc:'ORR',              zone:'IT/Tech',    sev:'low',      type:'Marathon',           lat:12.9601, lng:77.7000, time:'5h ago',  icon:'🏃',   desc:'Bengaluru Night Run. Roads closed 10PM-4AM.',                   source:'Facebook' },
  { id:72, title:'Vehicle breakdown – Sarjapur junction',loc:'Sarjapur Road',    zone:'IT/Tech',    sev:'low',      type:'Vehicle Breakdown',  lat:12.9124, lng:77.6908, time:'55m ago', icon:'🚘',   desc:'KSRTC bus stalled on main road. Tow truck delayed.',            source:'Twitter' },
  { id:73, title:'Flooding – Bellandur ORR underpass',   loc:'Bellandur',        zone:'IT/Tech',    sev:'critical', type:'Flooding',           lat:12.9261, lng:77.6800, time:'10m ago', icon:'🌊',   desc:'Underpass fully submerged. Do not attempt to cross.',           source:'Twitter' },

  // ── INDUSTRIAL AREAS ──
  { id:74, title:'Gas leak – Peenya Industrial',         loc:'Peenya Industrial Area',zone:'Industrial',sev:'critical',type:'Gas Leak',        lat:13.0300, lng:77.5180, time:'8m ago',  icon:'☣️',   desc:'Ammonia leak from cold storage. 500m zone cleared.',            source:'Google News' },
  { id:75, title:'Factory fire – Bommasandra',           loc:'Bommasandra',      zone:'Industrial', sev:'critical', type:'Fire Accident',      lat:12.7953, lng:77.6707, time:'12m ago', icon:'🔥',   desc:'Plastic factory fire. Black smoke. Roads closed.',              source:'Google News' },
  { id:76, title:'Explosion risk – Jigani',              loc:'Jigani Industrial',zone:'Industrial', sev:'high',     type:'Explosion',          lat:12.7885, lng:77.5916, time:'25m ago', icon:'💥',   desc:'Chemical storage overheat warning. Evacuation underway.',       source:'Google News' },
  { id:77, title:'Power cut – Peenya factories',         loc:'Peenya',           zone:'Industrial', sev:'medium',   type:'Power Cut',          lat:13.0284, lng:77.5165, time:'1h ago',  icon:'🔌',   desc:'HT line fault. 200+ industrial units without power.',           source:'BESCOM App' },
  { id:78, title:'Road block – Bidadi highway',          loc:'Bidadi Industrial',zone:'Industrial', sev:'medium',   type:'Road Block',         lat:12.8041, lng:77.3941, time:'2h ago',  icon:'⛔',   desc:'Industrial vehicle breakdown. NH-48 partially blocked.',        source:'Twitter' },

  // ── PERIPHERAL / SUBURBAN ──
  { id:79, title:'Road accident – Anekal Highway',       loc:'Anekal',           zone:'Peripheral', sev:'high',     type:'Road Accident',      lat:12.7112, lng:77.6975, time:'35m ago', icon:'🚗💥', desc:'Lorry accident on NH-48 near Anekal. 1 critical injury.',       source:'Twitter' },
  { id:80, title:'Flooding – Attibele road',             loc:'Attibele',         zone:'Peripheral', sev:'high',     type:'Flooding',           lat:12.7741, lng:77.7697, time:'20m ago', icon:'🌊',   desc:'Kolar road section flooded after heavy rain.',                  source:'Twitter' },
  { id:81, title:'Protest – Nelamangala',                loc:'Nelamangala',      zone:'Peripheral', sev:'medium',   type:'Protest',            lat:13.0982, lng:77.3934, time:'1h ago',  icon:'✊',   desc:'Villagers block NH-48 over compensation demands.',              source:'Twitter' },
  { id:82, title:'Vehicle breakdown – Hoskote',          loc:'Hoskote',          zone:'Peripheral', sev:'low',      type:'Vehicle Breakdown',  lat:13.0735, lng:77.7981, time:'3h ago',  icon:'🚘',   desc:'Truck breakdown on Hoskote-KR Puram highway.',                  source:'Twitter' },
  { id:83, title:'Road repair – Doddaballapur',          loc:'Doddaballapur',    zone:'Peripheral', sev:'low',      type:'Road Repair',        lat:13.2960, lng:77.5383, time:'8h ago',  icon:'🛠️',  desc:'NH-648 pothole repair work. Single lane available.',            source:'BBMP Feed' },
  { id:84, title:'Cyclone alert – South Bengaluru',      loc:'Ramanagara Road',  zone:'Peripheral', sev:'high',     type:'Cyclone Alert',      lat:12.8350, lng:77.5400, time:'2h ago',  icon:'🌀',   desc:'IMD warning: severe thunderstorms approaching.',                source:'IMD India' },
  { id:85, title:'Water shortage – Attibele residential',loc:'Attibele',         zone:'Peripheral', sev:'medium',   type:'Water Shortage',     lat:12.7741, lng:77.7700, time:'5h ago',  icon:'🚱',   desc:'New layout area not connected to main pipeline.',              source:'BWSSB App' },

  // ── ADDITIONAL SPREAD ──
  { id:86, title:'Storm damage – Hebbal lake',           loc:'Hebbal',           zone:'North',      sev:'medium',   type:'Storm',              lat:13.0359, lng:77.5980, time:'3h ago',  icon:'⛈️',  desc:'Fallen trees blocking access road near lake.',                  source:'Facebook' },
  { id:87, title:'Heavy rain – Yelahanka',               loc:'Yelahanka',        zone:'North',      sev:'medium',   type:'Heavy Rain',         lat:13.1007, lng:77.5960, time:'1h ago',  icon:'🌧️',  desc:'90mm rain. Roads slippery. Drive carefully.',                   source:'IMD India' },
  { id:88, title:'Garbage strike – Jayanagar',           loc:'Jayanagar',        zone:'South',      sev:'medium',   type:'Garbage Strike',     lat:12.9250, lng:77.5940, time:'10h ago', icon:'🗑️',  desc:'BBMP workers on strike. 3-day skip in collection.',             source:'Twitter' },
  { id:89, title:'Explosion scare – Richmond Town',      loc:'Richmond Town',    zone:'Central',    sev:'high',     type:'Explosion',          lat:12.9619, lng:77.6000, time:'1.5h ago',icon:'💥',   desc:'Transformer explosion near club. No injuries.',                 source:'Twitter' },
  { id:90, title:'Marathon – Whitefield',                loc:'Whitefield',       zone:'East',       sev:'low',      type:'Marathon',           lat:12.9698, lng:77.7499, time:'6h ago',  icon:'🏃',   desc:'Corporate run event. Roads closed till 9AM.',                   source:'Facebook' },
  { id:91, title:'Festival – Yelahanka',                 loc:'Yelahanka New Town',zone:'North',     sev:'low',      type:'Festival',           lat:13.1007, lng:77.5955, time:'4h ago',  icon:'🎉',   desc:'Dasara celebration event. 5k+ residents expected.',             source:'Instagram' },
  { id:92, title:'Medical emergency – Jayanagar',        loc:'Manipal Jayanagar',zone:'South',      sev:'high',     type:'Medical Emergency',  lat:12.9250, lng:77.5935, time:'35m ago', icon:'🚑',   desc:'Multi-patient emergency. Ambulance queue at OT.',              source:'Twitter' },
  { id:93, title:'Power cut – Electronic City',          loc:'Electronic City',  zone:'IT/Tech',    sev:'medium',   type:'Power Cut',          lat:12.8454, lng:77.6600, time:'2h ago',  icon:'🔌',   desc:'BESCOM load shedding. 4h rotation across sectors.',             source:'BESCOM App' },
  { id:94, title:'Road block – MG Road VIP',             loc:'MG Road',          zone:'Central',    sev:'low',      type:'Road Block',         lat:12.9752, lng:77.6091, time:'1h ago',  icon:'⛔',   desc:'CM convoy. MG Road closed 20 min.',                             source:'Twitter' },
  { id:95, title:'Waterlogging – Majestic underpass',    loc:'Majestic',         zone:'Central',    sev:'high',     type:'Waterlogging',       lat:12.9772, lng:77.5700, time:'20m ago', icon:'💧',   desc:'Underpass 2ft deep waterlogged. Do not enter.',                source:'Twitter' },
  { id:96, title:'Concert crowd – MG Road',              loc:'The Forum Mall',   zone:'East',       sev:'medium',   type:'High Crowd Density', lat:12.9614, lng:77.6380, time:'3h ago',  icon:'👥',   desc:'Weekend concert. 8000 expected. Metro advised.',                source:'Instagram' },
  { id:97, title:'BBMP work – Sarjapur',                 loc:'Sarjapur Road',    zone:'IT/Tech',    sev:'low',      type:'BBMP Maintenance',   lat:12.9060, lng:77.6875, time:'6h ago',  icon:'🏗️',  desc:'Storm drain deepening work. Lane closed 9AM-6PM.',              source:'BBMP Feed' },
  { id:98, title:'Queue congestion – BMTC depot',        loc:'Shantinagar',      zone:'Central',    sev:'low',      type:'Queue Congestion',   lat:12.9612, lng:77.5975, time:'50m ago', icon:'🧍',   desc:'Bus pass queue 200m long. System upgrade ongoing.',             source:'BMTC Feed' },
  { id:99, title:'Landslide – Airport outskirts',        loc:'Devanahalli',      zone:'North',      sev:'high',     type:'Landslide',          lat:13.2468, lng:77.7110, time:'1.5h ago',icon:'🪨',   desc:'Hillside slippage blocks approach road. Detour active.',        source:'Google News' },
  { id:100,title:'Religious gathering – Shivajinagar',   loc:'Shivajinagar',     zone:'Central',    sev:'low',      type:'Religious Gathering', lat:12.9880, lng:77.5980, time:'2h ago', icon:'🛕',   desc:'Large temple event. Foot traffic high, slow vehicles.',         source:'Instagram' },
  { id:101,title:'Heavy rain warning – North Bengaluru', loc:'Yelahanka-Hebbal', zone:'North',      sev:'medium',   type:'Heavy Rain',         lat:13.0700, lng:77.5980, time:'30m ago', icon:'🌧️',  desc:'IMD red alert. 100mm rain expected in 3 hours.',                source:'IMD India' },
  { id:102,title:'Flyover closure – Tin Factory',        loc:'Tin Factory',      zone:'East',       sev:'high',     type:'Flyover Closure',    lat:12.9960, lng:77.6580, time:'4h ago',  icon:'🌉',   desc:'Emergency structural inspection. ORR blocked.',                 source:'BBMP Feed' },
  { id:103,title:'Power cut – Bommasandra',              loc:'Bommasandra',      zone:'Industrial', sev:'medium',   type:'Power Cut',          lat:12.7953, lng:77.6705, time:'3h ago',  icon:'🔌',   desc:'Industrial zone feeder tripped. 150 units affected.',           source:'BESCOM App' },
  { id:104,title:'Protest – Kanakapura Road',            loc:'Kanakapura Road',  zone:'South',      sev:'medium',   type:'Protest',            lat:12.8914, lng:77.5598, time:'1.5h ago',icon:'✊',   desc:'Residents protest SWR train stoppage removal.',                source:'Twitter' },
  { id:105,title:'Vehicle breakdown – Electronic City',  loc:'Electronic City Flyover',zone:'IT/Tech',sev:'medium', type:'Vehicle Breakdown',  lat:12.8454, lng:77.6600, time:'45m ago', icon:'🚘',   desc:'Tanker broke down on flyover. 6km queue forming.',              source:'Twitter' },
];

export const ALERTS = [
  { id:1, title:'Flash Flood Warning — Bellandur & Varthur', desc:'Both lakes breaching. NDRF deployed. Avoid ORR from Silk Board to KR Puram.',     sev:'critical', expires:'Tonight 11PM',   icon:'🌊', zone:'East' },
  { id:2, title:'Factory Fire — Peenya Industrial Area',     desc:'Toxic fumes from chemical factory. 1km evacuation ACTIVE.',                         sev:'critical', expires:'Ongoing',         icon:'🔥', zone:'North' },
  { id:3, title:'Gas Leak — Peenya (Ammonia)',               desc:'Ammonia leak from cold storage. Do not enter Peenya zone.',                          sev:'critical', expires:'Under control',   icon:'☣️', zone:'Industrial' },
  { id:4, title:'Electrocution Hazard — Basavanagudi',       desc:'Live wire on SVP Road. Keep clear. BESCOM team en-route.',                           sev:'critical', expires:'Immediate',       icon:'⚡', zone:'South' },
  { id:5, title:'Building Collapse — Mahadevapura',          desc:'Under-construction site partial collapse. 2 people trapped. Rescue underway.',        sev:'critical', expires:'Active',          icon:'🏚️',zone:'East' },
  { id:6, title:'Traffic Jam — Silk Board (60+ min)',        desc:'Worst peak commute. Use Hosur Road flyover/NICE Road interchange as alternate.',      sev:'high',     expires:'9:30 PM today',   icon:'🚦', zone:'South' },
  { id:7, title:'Stampede Risk — Lalbagh Flower Show',       desc:'Overcrowded venue. Police managing crowd exits. Delay your visit.',                   sev:'high',     expires:'8:00 PM today',   icon:'⚠️', zone:'South' },
  { id:8, title:'IMD Red Alert — Heavy Rain (North Blr)',    desc:'100mm+ rain expected in 3 hours. Yelahanka, Hebbal, Devanahalli areas.',               sev:'high',     expires:'11:00 PM today',  icon:'🌧️',zone:'North' },
];

export const SOCIAL_POSTS = [
  { id:1, platform:'twitter',   verified:true,  user:'@BlrTrafficPolice',   loc:'Silk Board',    text:'WARNING: Silk Board gridlocked. 60 min. Avoid ORR. Use Hosur flyover. #BangaloreTraffic', time:'2m ago',  tags:['#BangaloreTraffic'],   sev:'high',     type:'Traffic Congestion', icon:'🚦' },
  { id:2, platform:'twitter',   verified:false, user:'@BengaluruNews',      loc:'Bellandur',     text:'BREAKING: Bellandur lake flooding roads near EPL. 3 cars submerged! #BangaloreFloods',    time:'5m ago',  tags:['#BangaloreFloods'],    sev:'critical', type:'Flooding',            icon:'🌊' },
  { id:3, platform:'facebook',  verified:true,  user:'Marathahalli Alerts', loc:'Marathahalli',  text:'Sewage overflow at Marathahalli bridge. Road slippery. BBMP notified! #BBMP',              time:'12m ago', tags:['#BBMP'],               sev:'high',     type:'Drainage Overflow',   icon:'🚽' },
  { id:4, platform:'twitter',   verified:false, user:'@PeenyaAlert',        loc:'Peenya',        text:'Massive fire at chemical factory in Peenya! Black smoke visible 5km away 🔥 #PeenyaFire', time:'18m ago', tags:['#PeenyaFire'],         sev:'critical', type:'Fire Accident',        icon:'🔥' },
  { id:5, platform:'instagram', verified:true,  user:'@blr_safety',         loc:'Indiranagar',   text:'Gas leak smell near 100ft road CMR hospital junction. People evacuating! ☣️ Stay away.',   time:'24m ago', tags:['#GasLeak'],            sev:'high',     type:'Gas Leak',            icon:'☣️' },
  { id:6, platform:'twitter',   verified:false, user:'@LalbaughVisitor',    loc:'Lalbagh',       text:'Massive crowd at Lalbagh flower show entrance. People pushing! Very risky #Stampede',      time:'38m ago', tags:['#Lalbagh'],            sev:'high',     type:'Stampede Risk',       icon:'⚠️' },
  { id:7, platform:'twitter',   verified:true,  user:'@NDRF_Official',      loc:'Basavanagudi',  text:'Alert: Live wire on SVP Road, Basavanagudi. BESCOM dispatched. ⚡ Keep clear.',            time:'15m ago', tags:['#ElectricalHazard'],   sev:'critical', type:'Electrocution',        icon:'⚡' },
  { id:8, platform:'facebook',  verified:false, user:'Whitefield Community',loc:'Whitefield',    text:'Phoenix Mall basement parking flooded. Avoid until 7PM. Cars getting damaged inside.',     time:'45m ago', tags:['#Whitefield'],         sev:'medium',   type:'Waterlogging',        icon:'💧' },
  { id:9, platform:'twitter',   verified:true,  user:'@IMDWeather',         loc:'North Bengaluru',text:'🔴 RED ALERT: Extremely heavy rainfall expected near Yelahanka, Hebbal zones. Stay safe.',  time:'30m ago', tags:['#BengaluruRains'],     sev:'high',     type:'Heavy Rain',          icon:'🌧️' },
  { id:10,platform:'instagram', verified:false, user:'@KoramangalaLife',    loc:'Koramangala',   text:'Power gone in 5th and 6th block since 2 hours. BESCOM helpline not responding. 🔌',        time:'2h ago',  tags:['#PowerCut'],           sev:'medium',   type:'Power Cut',           icon:'🔌' },
];

export const ZONE_STATS = [
  { zone:'Central',    count:12, color:'#60a5fa' },
  { zone:'North',      count:12, color:'#4ade80' },
  { zone:'South',      count:14, color:'#facc15' },
  { zone:'East',       count:13, color:'#f87171' },
  { zone:'West',       count:10, color:'#fb923c' },
  { zone:'IT/Tech',    count:12, color:'#a78bfa' },
  { zone:'Industrial', count:5,  color:'#94a3b8' },
  { zone:'Peripheral', count:7,  color:'#64748b' },
];

export const NAV = [
  { id:'dashboard',  label:'Safety Dashboard',       icon:'🛡️' },
  { id:'navigation', label:'Smart Navigation',        icon:'🧭' },
  { id:'nearby',     label:'Nearby Events',           icon:'📍' },
  { id:'social',     label:'Social Media Monitor',    icon:'💬' },
  { id:'reports',    label:'Report Center',           icon:'📋' },
  { id:'ai',         label:'AI Agent',                icon:'🤖' },
  { id:'overview',   label:'Bangalore City Overview', icon:'🏙️' },
  { id:'myreports',  label:'My Reports',              icon:'📄' },
  { id:'alerts',     label:'Safety Alerts',           icon:'🔔' },
  { id:'analytics',  label:'Analytics',               icon:'📊' },
  { id:'apidocs',    label:'API Documentation',       icon:'</>' },
  { id:'profile',    label:'Profile',                 icon:'👤' },
];

export const EVENT_TYPES = ['All', ...Object.keys(EVENT_TYPE_META)];
export const RANGES = ['2km', '5km', '10km', '20km', '50km'];
export const ZONES = ['All Zones', 'Central', 'North', 'South', 'East', 'West', 'IT/Tech', 'Industrial', 'Peripheral'];
