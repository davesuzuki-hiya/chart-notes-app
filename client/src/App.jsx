import React, { useState, useEffect, useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import Chart from './components/Chart';
import ChartSettings from './components/ChartSettings';
import DataPointForm from './components/DataPointForm';
import DataPointsList from './components/DataPointsList';
import NotesToggle from './components/NotesToggle';
import {
  getPoints,
  createPoint,
  updatePoint,
  deletePoint,
  clearAllPoints,
  getSettings,
  saveSettings,
} from './api';

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

export default function App() {
  const [points, setPoints] = useState([]);
  const [editingPoint, setEditingPoint] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const chartRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  // Auto-save settings with debounce
  const debouncedSaveSettings = useCallback((newSettings) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      saveSettings(newSettings).catch((err) =>
        console.error('Failed to save settings:', err)
      );
    }, 500);
  }, []);

  async function loadData() {
    try {
      const [pointsData, settingsData] = await Promise.all([
        getPoints(),
        getSettings(),
      ]);
      setPoints(pointsData);
      setSettings({ ...DEFAULT_SETTINGS, ...settingsData });
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  }

  function handleSettingsChange(newSettings) {
    setSettings(newSettings);
    debouncedSaveSettings(newSettings);
  }

  async function handleSave(pointData) {
    try {
      if (editingPoint) {
        const updated = await updatePoint(editingPoint.id, pointData);
        setPoints(points.map((p) => (p.id === updated.id ? updated : p)));
        setEditingPoint(null);
      } else {
        const created = await createPoint(pointData);
        setPoints([...points, created]);
      }
    } catch (err) {
      console.error('Failed to save point:', err);
    }
  }

  async function handleBulkAdd(newPoints) {
    try {
      const created = [];
      for (const point of newPoints) {
        const result = await createPoint(point);
        created.push(result);
      }
      setPoints([...points, ...created]);
    } catch (err) {
      console.error('Failed to bulk add points:', err);
    }
  }

  async function handleUpdate(id, pointData) {
    try {
      const updated = await updatePoint(id, pointData);
      setPoints(points.map((p) => (p.id === updated.id ? updated : p)));
    } catch (err) {
      console.error('Failed to update point:', err);
    }
  }

  async function handleDelete(id) {
    try {
      await deletePoint(id);
      setPoints(points.filter((p) => p.id !== id));
      setEditingPoint(null);
    } catch (err) {
      console.error('Failed to delete point:', err);
    }
  }

  async function handleClearAll() {
    if (!window.confirm('Are you sure you want to delete all data points?')) return;
    try {
      await clearAllPoints();
      setPoints([]);
      setEditingPoint(null);
    } catch (err) {
      console.error('Failed to clear points:', err);
    }
  }

  function handlePointClick(point) {
    setEditingPoint(point);
  }

  async function handleExportPng() {
    if (!chartRef.current) return;
    try {
      const dataUrl = await toPng(chartRef.current, {
        backgroundColor: settings.theme === 'dark' ? '#1a1a2e' : '#ffffff',
        pixelRatio: 2,
      });
      const link = document.createElement('a');
      link.download = `${settings.title || 'chart'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export PNG:', err);
    }
  }

  if (loading) {
    return <div className="app">Loading...</div>;
  }

  const isDark = settings.theme === 'dark';

  return (
    <div className={`app ${isDark ? 'dark' : ''}`}>
      <h1>Chart Notes</h1>

      <div className={`chart-container ${isDark ? 'dark' : ''}`}>
        <div className="controls">
          <NotesToggle
            showNotes={showNotes}
            onToggle={() => setShowNotes(!showNotes)}
          />
          {points.length > 0 && (
            <>
              <button className="export-btn" onClick={handleExportPng}>
                Export PNG
              </button>
              <button className="clear-btn" onClick={handleClearAll}>
                Clear All
              </button>
            </>
          )}
        </div>
        <ChartSettings settings={settings} onChange={handleSettingsChange} />
        <Chart
          ref={chartRef}
          data={points}
          showNotes={showNotes}
          onPointClick={handlePointClick}
          settings={settings}
        />
      </div>

      <DataPointForm
        editingPoint={editingPoint}
        onSave={handleSave}
        onCancel={() => setEditingPoint(null)}
        onDelete={handleDelete}
        onBulkAdd={handleBulkAdd}
      />

      <DataPointsList
        points={points}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
}
