import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'data.json');

const DEFAULT_SETTINGS = {
  title: '',
  lineStyle: 'curved',
  xAxisTitle: '',
  yAxisTitle: '',
  lineColor: '#3498db',
  dotColor: '#3498db',
  bubbleColor: '#333333',
  theme: 'light',
  showGrid: true,
};

function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('Error loading data:', err);
  }
  return { points: [], nextId: 1, settings: DEFAULT_SETTINGS };
}

function saveData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

export function getAll() {
  const data = loadData();
  return data.points;
}

export function create(point) {
  const data = loadData();
  const newPoint = {
    id: data.nextId++,
    month: point.month,
    value: point.value,
    note: point.note || null,
    created_at: new Date().toISOString(),
  };
  data.points.push(newPoint);
  saveData(data);
  return newPoint;
}

export function update(id, updates) {
  const data = loadData();
  const index = data.points.findIndex((p) => p.id === id);
  if (index === -1) return null;
  data.points[index] = { ...data.points[index], ...updates };
  saveData(data);
  return data.points[index];
}

export function remove(id) {
  const data = loadData();
  const index = data.points.findIndex((p) => p.id === id);
  if (index === -1) return false;
  data.points.splice(index, 1);
  saveData(data);
  return true;
}

export function findById(id) {
  const data = loadData();
  return data.points.find((p) => p.id === id) || null;
}

export function clearAll() {
  const data = loadData();
  saveData({ points: [], nextId: 1, settings: data.settings || DEFAULT_SETTINGS });
}

export function getSettings() {
  const data = loadData();
  return { ...DEFAULT_SETTINGS, ...data.settings };
}

export function saveSettings(settings) {
  const data = loadData();
  data.settings = { ...DEFAULT_SETTINGS, ...settings };
  saveData(data);
  return data.settings;
}
