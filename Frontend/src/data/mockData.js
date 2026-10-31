// IndustrialGuard AI — Mock Data Layer
// All data is synthetic / demo. No real industrial measurements.

export const sites = [
  { id: 'plant-a', name: 'Plant A — Main Manufacturing Floor', location: 'Building 1, North Wing' },
  { id: 'plant-b', name: 'Plant B — Assembly & Packaging', location: 'Building 2, South Wing' },
];

export const zones = [
  { id: 'zone-a', siteId: 'plant-a', name: 'Zone A — Assembly Line' },
  { id: 'zone-b', siteId: 'plant-a', name: 'Zone B — Welding Bay' },
  { id: 'zone-c', siteId: 'plant-a', name: 'Zone C — Chemical Storage' },
  { id: 'zone-d', siteId: 'plant-a', name: 'Zone D — Loading Dock' },
  { id: 'zone-e', siteId: 'plant-b', name: 'Zone E — Packaging Line' },
  { id: 'zone-f', siteId: 'plant-b', name: 'Zone F — Quality Control' },
];

export const users = [
  { id: 'user-1', name: 'Anjali Kumari', role: 'Safety Officer', avatar: null, email: 'anjali.k@industrialguard.demo' },
  { id: 'user-2', name: 'Abhay Singh', role: 'Shift Supervisor', avatar: null, email: 'abhay.s@industrialguard.demo' },
  { id: 'user-3', name: 'Priya Sharma', role: 'Plant Manager', avatar: null, email: 'priya.s@industrialguard.demo' },
];

export const roles = ['Safety Officer', 'Shift Supervisor', 'Plant Manager'];

// ── Sensor definitions ──
export const sensorDefinitions = [
  {
    id: 'temp-01',
    type: 'temperature',
    label: 'Temperature',
    unit: '°C',
    icon: 'Thermometer',
    zone: 'Zone A — Assembly Line',
    siteId: 'plant-a',
    thresholds: { safe: [15, 35], warning: [35, 45], critical: [45, 999] },
  },
  {
    id: 'hum-01',
    type: 'humidity',
    label: 'Humidity',
    unit: '%',
    icon: 'Droplets',
    zone: 'Zone A — Assembly Line',
    siteId: 'plant-a',
    thresholds: { safe: [30, 60], warning: [60, 75], critical: [75, 100] },
  },
  {
    id: 'gas-01',
    type: 'gas',
    label: 'Gas Level',
    unit: 'ppm',
    icon: 'Wind',
    zone: 'Zone C — Chemical Storage',
    siteId: 'plant-a',
    thresholds: { safe: [0, 50], warning: [50, 80], critical: [80, 999] },
  },
  {
    id: 'smoke-01',
    type: 'smoke',
    label: 'Smoke Density',
    unit: '%',
    icon: 'CloudFog',
    zone: 'Zone B — Welding Bay',
    siteId: 'plant-a',
    thresholds: { safe: [0, 15], warning: [15, 30], critical: [30, 100] },
  },
];

// ── Helper: generate time series ──
function generateTimeSeries(hours, interval, baseFn) {
  const now = new Date();
  const points = [];
  const totalPoints = Math.floor((hours * 60) / interval);
  for (let i = totalPoints; i >= 0; i--) {
    const time = new Date(now.getTime() - i * interval * 60000);
    points.push({
      time: time.toISOString(),
      label: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      value: baseFn(i, totalPoints),
    });
  }
  return points;
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// ── Sensor readings (current + history) ──
export function getInitialSensorReadings() {
  return {
    temperature: {
      current: 34.2,
      status: 'safe',
      online: true,
      lastUpdated: new Date().toISOString(),
      history: generateTimeSeries(6, 5, (i, total) =>
        clamp(28 + 8 * Math.sin(i / total * Math.PI * 2) + (Math.random() - 0.5) * 3, 20, 48)
      ),
    },
    humidity: {
      current: 58,
      status: 'safe',
      online: true,
      lastUpdated: new Date().toISOString(),
      history: generateTimeSeries(6, 5, (i, total) =>
        clamp(55 + 10 * Math.cos(i / total * Math.PI * 1.5) + (Math.random() - 0.5) * 5, 30, 85)
      ),
    },
    gas: {
      current: 42,
      status: 'safe',
      online: true,
      lastUpdated: new Date().toISOString(),
      history: generateTimeSeries(6, 5, (i, total) =>
        clamp(35 + 15 * Math.sin(i / total * Math.PI * 3) + (Math.random() - 0.5) * 8, 5, 95)
      ),
    },
    smoke: {
      current: 8,
      status: 'safe',
      online: true,
      lastUpdated: new Date().toISOString(),
      history: generateTimeSeries(6, 5, (i, total) =>
        clamp(6 + 4 * Math.sin(i / total * Math.PI) + (Math.random() - 0.5) * 3, 0, 40)
      ),
    },
  };
}

// ── Risk assessment ──
export function getInitialRiskAssessment() {
  return {
    score: 34,
    state: 'WARNING',
    timestamp: new Date().toISOString(),
    explanation: 'Gas readings approaching elevated threshold in Zone C. Temperature stable. No active vision events.',
    contributing: [
      { signal: 'Gas level trending upward', weight: 'high' },
      { signal: 'Temperature within normal range', weight: 'low' },
      { signal: 'No PPE violations detected', weight: 'low' },
    ],
    history: generateTimeSeries(24, 15, (i, total) =>
      clamp(25 + 20 * Math.sin(i / total * Math.PI * 2) + (Math.random() - 0.5) * 10, 5, 90)
    ),
  };
}

// ── Alerts ──
export const initialAlerts = [
  {
    id: 'ALT-001',
    severity: 'critical',
    title: 'Gas level exceeded safety threshold',
    source: 'Gas Sensor GS-01',
    sourceType: 'sensor',
    zone: 'Zone C — Chemical Storage',
    siteId: 'plant-a',
    timestamp: new Date(Date.now() - 8 * 60000).toISOString(),
    status: 'active',
    sensorContext: { type: 'gas', value: 86, unit: 'ppm', threshold: 80 },
    cvContext: null,
    recommendation: 'Evacuate Zone C. Verify gas sensor calibration. Deploy ventilation protocol.',
  },
  {
    id: 'ALT-002',
    severity: 'warning',
    title: 'Elevated temperature detected',
    source: 'Temperature Sensor TS-02',
    sourceType: 'sensor',
    zone: 'Zone B — Welding Bay',
    siteId: 'plant-a',
    timestamp: new Date(Date.now() - 22 * 60000).toISOString(),
    status: 'active',
    sensorContext: { type: 'temperature', value: 41.8, unit: '°C', threshold: 35 },
    cvContext: null,
    recommendation: 'Monitor temperature trend. Review welding schedule. Check HVAC operation.',
  },
  {
    id: 'ALT-003',
    severity: 'warning',
    title: 'PPE violation — Missing safety helmet',
    source: 'Camera CAM-03',
    sourceType: 'vision',
    zone: 'Zone A — Assembly Line',
    siteId: 'plant-a',
    timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
    status: 'acknowledged',
    sensorContext: null,
    cvContext: { event: 'Helmet not detected', confidence: 0.87, cameraId: 'CAM-03' },
    recommendation: 'Verify PPE compliance in Zone A. Issue reminder to shift personnel.',
  },
  {
    id: 'ALT-004',
    severity: 'safe',
    title: 'Smoke levels returned to normal',
    source: 'Smoke Sensor SM-01',
    sourceType: 'sensor',
    zone: 'Zone B — Welding Bay',
    siteId: 'plant-a',
    timestamp: new Date(Date.now() - 48 * 60000).toISOString(),
    status: 'resolved',
    sensorContext: { type: 'smoke', value: 7, unit: '%', threshold: 15 },
    cvContext: null,
    recommendation: 'No further action required. Maintain regular monitoring.',
  },
  {
    id: 'ALT-005',
    severity: 'critical',
    title: 'Multiple safety signals — compound risk',
    source: 'Risk Fusion Engine',
    sourceType: 'fusion',
    zone: 'Zone C — Chemical Storage',
    siteId: 'plant-a',
    timestamp: new Date(Date.now() - 55 * 60000).toISOString(),
    status: 'active',
    sensorContext: { type: 'gas', value: 82, unit: 'ppm', threshold: 80 },
    cvContext: { event: 'Safety vest not detected', confidence: 0.79, cameraId: 'CAM-05' },
    recommendation: 'Immediate supervisor review required. Multiple risk indicators active simultaneously.',
  },
  {
    id: 'ALT-006',
    severity: 'warning',
    title: 'Humidity exceeding comfort range',
    source: 'Humidity Sensor HS-01',
    sourceType: 'sensor',
    zone: 'Zone A — Assembly Line',
    siteId: 'plant-a',
    timestamp: new Date(Date.now() - 72 * 60000).toISOString(),
    status: 'acknowledged',
    sensorContext: { type: 'humidity', value: 71, unit: '%', threshold: 60 },
    cvContext: null,
    recommendation: 'Increase ventilation. Check dehumidifier operation.',
  },
  {
    id: 'ALT-007',
    severity: 'safe',
    title: 'Gas sensor calibration verified',
    source: 'Gas Sensor GS-02',
    sourceType: 'sensor',
    zone: 'Zone D — Loading Dock',
    siteId: 'plant-a',
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
    status: 'resolved',
    sensorContext: { type: 'gas', value: 12, unit: 'ppm', threshold: 50 },
    cvContext: null,
    recommendation: 'Calibration complete. Sensor operating within spec.',
  },
  {
    id: 'ALT-008',
    severity: 'warning',
    title: 'Unusual temperature spike near machinery',
    source: 'Temperature Sensor TS-03',
    sourceType: 'sensor',
    zone: 'Zone D — Loading Dock',
    siteId: 'plant-a',
    timestamp: new Date(Date.now() - 180 * 60000).toISOString(),
    status: 'resolved',
    sensorContext: { type: 'temperature', value: 38.5, unit: '°C', threshold: 35 },
    cvContext: null,
    recommendation: 'Inspect machinery in Zone D for overheating components.',
  },
];

// ── Incidents ──
export const initialIncidents = [
  {
    id: 'INC-2024-001',
    type: 'Gas Leak',
    severity: 'critical',
    siteId: 'plant-a',
    zone: 'Zone C — Chemical Storage',
    createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60000).toISOString(),
    assignedTo: 'Anjali Kumari',
    status: 'open',
    description: 'Gas sensor GS-01 detected readings above 80 ppm in Zone C. Automated alert triggered. Area inspection required.',
    sensorContext: { type: 'gas', peakValue: 86, unit: 'ppm', duration: '18 min' },
    visionContext: { event: 'Safety vest not detected near gas storage', confidence: 0.79 },
    notes: [
      { author: 'System', text: 'Incident auto-created from alert ALT-001', timestamp: new Date(Date.now() - 2 * 3600000).toISOString() },
      { author: 'Anjali Kumari', text: 'Dispatching team to Zone C for physical verification', timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString() },
    ],
    timeline: [
      { event: 'Gas level exceeded threshold', timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), type: 'trigger' },
      { event: 'Alert ALT-001 generated', timestamp: new Date(Date.now() - 2 * 3600000 + 5000).toISOString(), type: 'alert' },
      { event: 'Incident created', timestamp: new Date(Date.now() - 2 * 3600000 + 10000).toISOString(), type: 'created' },
      { event: 'Assigned to Anjali Kumari', timestamp: new Date(Date.now() - 1.5 * 3600000).toISOString(), type: 'assigned' },
    ],
  },
  {
    id: 'INC-2024-002',
    type: 'PPE Violation',
    severity: 'warning',
    siteId: 'plant-a',
    zone: 'Zone A — Assembly Line',
    createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600000).toISOString(),
    assignedTo: 'Abhay Singh',
    status: 'assigned',
    description: 'Camera CAM-03 detected a worker without safety helmet in Zone A assembly area.',
    sensorContext: null,
    visionContext: { event: 'Helmet not detected', confidence: 0.87, imageRef: 'Evidence will be available after CV pipeline integration' },
    notes: [
      { author: 'System', text: 'Incident created from alert ALT-003', timestamp: new Date(Date.now() - 4 * 3600000).toISOString() },
      { author: 'Abhay Singh', text: 'Will conduct PPE compliance check during next round', timestamp: new Date(Date.now() - 3 * 3600000).toISOString() },
    ],
    timeline: [
      { event: 'PPE violation detected by CAM-03', timestamp: new Date(Date.now() - 4 * 3600000).toISOString(), type: 'trigger' },
      { event: 'Alert generated', timestamp: new Date(Date.now() - 4 * 3600000 + 3000).toISOString(), type: 'alert' },
      { event: 'Incident created', timestamp: new Date(Date.now() - 4 * 3600000 + 8000).toISOString(), type: 'created' },
      { event: 'Assigned to Abhay Singh', timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), type: 'assigned' },
    ],
  },
  {
    id: 'INC-2024-003',
    type: 'Temperature Exceedance',
    severity: 'warning',
    siteId: 'plant-a',
    zone: 'Zone B — Welding Bay',
    createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    assignedTo: 'Anjali Kumari',
    status: 'assigned',
    description: 'Temperature sensor TS-02 reported sustained readings above 38°C in the welding bay. HVAC check recommended.',
    sensorContext: { type: 'temperature', peakValue: 41.8, unit: '°C', duration: '45 min' },
    visionContext: null,
    notes: [
      { author: 'System', text: 'Incident created from alert ALT-002', timestamp: new Date(Date.now() - 6 * 3600000).toISOString() },
    ],
    timeline: [
      { event: 'Temperature exceeded threshold', timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), type: 'trigger' },
      { event: 'Alert generated', timestamp: new Date(Date.now() - 6 * 3600000 + 2000).toISOString(), type: 'alert' },
      { event: 'Incident created', timestamp: new Date(Date.now() - 6 * 3600000 + 5000).toISOString(), type: 'created' },
      { event: 'Assigned to Anjali Kumari', timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), type: 'assigned' },
    ],
  },
  {
    id: 'INC-2024-004',
    type: 'Compound Risk',
    severity: 'critical',
    siteId: 'plant-a',
    zone: 'Zone C — Chemical Storage',
    createdAt: new Date(Date.now() - 8 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
    assignedTo: 'Priya Sharma',
    status: 'resolved',
    description: 'Multiple risk indicators active simultaneously in Zone C. Gas + PPE concerns raised compound risk score.',
    sensorContext: { type: 'gas', peakValue: 82, unit: 'ppm', duration: '12 min' },
    visionContext: { event: 'Safety vest not detected', confidence: 0.79 },
    notes: [
      { author: 'System', text: 'Compound risk incident created from fusion engine', timestamp: new Date(Date.now() - 8 * 3600000).toISOString() },
      { author: 'Priya Sharma', text: 'Reviewed with safety team. Additional signage deployed. PPE audit scheduled.', timestamp: new Date(Date.now() - 7 * 3600000).toISOString() },
      { author: 'Priya Sharma', text: 'Resolved after verification. No injuries reported.', timestamp: new Date(Date.now() - 6 * 3600000).toISOString() },
    ],
    timeline: [
      { event: 'Compound risk detected', timestamp: new Date(Date.now() - 8 * 3600000).toISOString(), type: 'trigger' },
      { event: 'Critical alert generated', timestamp: new Date(Date.now() - 8 * 3600000 + 2000).toISOString(), type: 'alert' },
      { event: 'Incident created', timestamp: new Date(Date.now() - 8 * 3600000 + 5000).toISOString(), type: 'created' },
      { event: 'Escalated to Plant Manager', timestamp: new Date(Date.now() - 7.5 * 3600000).toISOString(), type: 'escalated' },
      { event: 'Assigned to Priya Sharma', timestamp: new Date(Date.now() - 7.5 * 3600000 + 3000).toISOString(), type: 'assigned' },
      { event: 'Resolved', timestamp: new Date(Date.now() - 6 * 3600000).toISOString(), type: 'resolved' },
    ],
  },
  {
    id: 'INC-2024-005',
    type: 'Smoke Detection',
    severity: 'warning',
    siteId: 'plant-a',
    zone: 'Zone B — Welding Bay',
    createdAt: new Date(Date.now() - 12 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 3600000).toISOString(),
    assignedTo: 'Abhay Singh',
    status: 'resolved',
    description: 'Smoke sensor SM-01 detected elevated smoke density during welding operations. Confirmed as expected operational byproduct.',
    sensorContext: { type: 'smoke', peakValue: 22, unit: '%', duration: '30 min' },
    visionContext: null,
    notes: [
      { author: 'System', text: 'Incident created from smoke alert', timestamp: new Date(Date.now() - 12 * 3600000).toISOString() },
      { author: 'Abhay Singh', text: 'Verified on-site. Smoke from scheduled welding operations. Ventilation adequate.', timestamp: new Date(Date.now() - 11 * 3600000).toISOString() },
      { author: 'Abhay Singh', text: 'Closing incident. No safety concern.', timestamp: new Date(Date.now() - 10 * 3600000).toISOString() },
    ],
    timeline: [
      { event: 'Smoke density elevated', timestamp: new Date(Date.now() - 12 * 3600000).toISOString(), type: 'trigger' },
      { event: 'Alert generated', timestamp: new Date(Date.now() - 12 * 3600000 + 2000).toISOString(), type: 'alert' },
      { event: 'Incident created', timestamp: new Date(Date.now() - 12 * 3600000 + 5000).toISOString(), type: 'created' },
      { event: 'Assigned to Abhay Singh', timestamp: new Date(Date.now() - 11.5 * 3600000).toISOString(), type: 'assigned' },
      { event: 'Resolved — operational byproduct', timestamp: new Date(Date.now() - 10 * 3600000).toISOString(), type: 'resolved' },
    ],
  },
  {
    id: 'INC-2024-006',
    type: 'Gas Leak',
    severity: 'critical',
    siteId: 'plant-a',
    zone: 'Zone D — Loading Dock',
    createdAt: new Date(Date.now() - 24 * 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 3600000).toISOString(),
    assignedTo: 'Anjali Kumari',
    status: 'resolved',
    description: 'Gas sensor GS-02 reported brief spike in Zone D. Traced to delivery vehicle exhaust. Ventilation restored levels.',
    sensorContext: { type: 'gas', peakValue: 68, unit: 'ppm', duration: '8 min' },
    visionContext: null,
    notes: [
      { author: 'System', text: 'Incident created from gas alert', timestamp: new Date(Date.now() - 24 * 3600000).toISOString() },
      { author: 'Anjali Kumari', text: 'Traced to delivery truck exhaust. Area ventilated. Levels returned to normal.', timestamp: new Date(Date.now() - 22 * 3600000).toISOString() },
      { author: 'Anjali Kumari', text: 'Recommending improved dock ventilation schedule.', timestamp: new Date(Date.now() - 20 * 3600000).toISOString() },
    ],
    timeline: [
      { event: 'Gas spike detected', timestamp: new Date(Date.now() - 24 * 3600000).toISOString(), type: 'trigger' },
      { event: 'Alert generated', timestamp: new Date(Date.now() - 24 * 3600000 + 2000).toISOString(), type: 'alert' },
      { event: 'Incident created', timestamp: new Date(Date.now() - 24 * 3600000 + 5000).toISOString(), type: 'created' },
      { event: 'Assigned to Anjali Kumari', timestamp: new Date(Date.now() - 23 * 3600000).toISOString(), type: 'assigned' },
      { event: 'Resolved', timestamp: new Date(Date.now() - 20 * 3600000).toISOString(), type: 'resolved' },
    ],
  },
];

// ── Analytics data ──
export const analyticsData = {
  riskOverTime: generateTimeSeries(72, 60, (i, total) =>
    clamp(30 + 25 * Math.sin(i / total * Math.PI * 4) + (Math.random() - 0.5) * 15, 5, 95)
  ),
  alertsBySeverity: [
    { name: 'Critical', value: 12, fill: '#ef4444' },
    { name: 'Warning', value: 28, fill: '#f59e0b' },
    { name: 'Safe / Info', value: 45, fill: '#10b981' },
  ],
  incidentsByCategory: [
    { category: 'Gas Leak', count: 8 },
    { category: 'PPE Violation', count: 14 },
    { category: 'Temperature', count: 6 },
    { category: 'Smoke', count: 4 },
    { category: 'Compound Risk', count: 3 },
  ],
  hazardFrequency: [
    { month: 'Apr', gas: 3, ppe: 5, temperature: 2, smoke: 1 },
    { month: 'May', gas: 2, ppe: 4, temperature: 3, smoke: 2 },
    { month: 'Jun', gas: 4, ppe: 6, temperature: 2, smoke: 1 },
    { month: 'Jul', gas: 1, ppe: 3, temperature: 4, smoke: 3 },
    { month: 'Aug', gas: 3, ppe: 7, temperature: 1, smoke: 2 },
    { month: 'Sep', gas: 2, ppe: 4, temperature: 2, smoke: 1 },
  ],
  resolutionStatus: [
    { name: 'Resolved', value: 38, fill: '#10b981' },
    { name: 'In Progress', value: 12, fill: '#3b82f6' },
    { name: 'Open', value: 5, fill: '#f59e0b' },
    { name: 'Escalated', value: 3, fill: '#ef4444' },
  ],
  zoneHotspots: [
    { zone: 'Zone A', risk: 28 },
    { zone: 'Zone B', risk: 45 },
    { zone: 'Zone C', risk: 72 },
    { zone: 'Zone D', risk: 18 },
  ],
  kpis: {
    avgRiskScore: 34,
    criticalIncidents: 4,
    mostFrequentHazard: 'PPE Violation',
    highestRiskZone: 'Zone C — Chemical Storage',
    avgResolutionTime: '2.4 hours',
  },
};

// ── Settings defaults ──
export const defaultSettings = {
  profile: {
    name: 'Anjali Kumari',
    email: 'anjali.k@industrialguard.demo',
    role: 'Safety Officer',
  },
  selectedSite: 'plant-a',
  notifications: {
    criticalAlerts: true,
    warningAlerts: true,
    incidentUpdates: true,
    dailyDigest: false,
    emailNotifications: false,
    soundAlerts: true,
  },
  thresholds: {
    temperature: { warning: 35, critical: 45 },
    humidity: { warning: 60, critical: 75 },
    gas: { warning: 50, critical: 80 },
    smoke: { warning: 15, critical: 30 },
  },
  interface: {
    theme: 'light',
    compactMode: false,
    autoRefresh: true,
    refreshInterval: 10,
  },
};

// ── Utility: determine sensor status from value ──
export function getSensorStatus(type, value) {
  const sensor = sensorDefinitions.find(s => s.type === type);
  if (!sensor) return 'safe';
  if (value >= sensor.thresholds.critical[0]) return 'critical';
  if (value >= sensor.thresholds.warning[0]) return 'warning';
  return 'safe';
}

// ── Utility: calculate overall safety state ──
export function calculateSafetyState(sensors) {
  const statuses = Object.values(sensors).map(s => s.status);
  if (statuses.includes('critical')) return 'CRITICAL';
  if (statuses.includes('warning')) return 'WARNING';
  return 'SAFE';
}

// ── Utility: simulate sensor drift ──
export function simulateSensorUpdate(readings) {
  const updated = { ...readings };
  for (const [type, data] of Object.entries(updated)) {
    const drift = (Math.random() - 0.5) * 3;
    const sensor = sensorDefinitions.find(s => s.type === type);
    const min = sensor ? sensor.thresholds.safe[0] : 0;
    const max = sensor ? sensor.thresholds.critical[1] : 100;
    const newVal = clamp(parseFloat((data.current + drift).toFixed(1)), min, Math.min(max, 100));
    const newStatus = getSensorStatus(type, newVal);
    updated[type] = {
      ...data,
      current: newVal,
      status: newStatus,
      lastUpdated: new Date().toISOString(),
    };
  }
  return updated;
}
