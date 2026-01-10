import express from 'express';
import cors from 'cors';
import * as db from './db.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get all data points
app.get('/api/points', (req, res) => {
  const points = db.getAll();
  res.json(points);
});

// Create a new data point
app.post('/api/points', (req, res) => {
  const { month, value, note } = req.body;
  if (!month || value === undefined) {
    return res.status(400).json({ error: 'month and value are required' });
  }
  const newPoint = db.create({ month, value, note });
  res.status(201).json(newPoint);
});

// Update a data point
app.put('/api/points/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { month, value, note } = req.body;
  const existing = db.findById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Data point not found' });
  }
  const updated = db.update(id, {
    month: month ?? existing.month,
    value: value ?? existing.value,
    note: note ?? existing.note,
  });
  res.json(updated);
});

// Delete a data point
app.delete('/api/points/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const success = db.remove(id);
  if (!success) {
    return res.status(404).json({ error: 'Data point not found' });
  }
  res.status(204).send();
});

// Clear all data points
app.delete('/api/points', (req, res) => {
  db.clearAll();
  res.status(204).send();
});

// Get settings
app.get('/api/settings', (req, res) => {
  const settings = db.getSettings();
  res.json(settings);
});

// Save settings
app.put('/api/settings', (req, res) => {
  const settings = db.saveSettings(req.body);
  res.json(settings);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
