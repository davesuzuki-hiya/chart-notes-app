import React, { useState } from 'react';

const PRESET_THEMES = {
  default: { lineColor: '#3498db', dotColor: '#3498db', bubbleColor: '#333333' },
  sunset: { lineColor: '#e74c3c', dotColor: '#e74c3c', bubbleColor: '#c0392b' },
  forest: { lineColor: '#27ae60', dotColor: '#27ae60', bubbleColor: '#1e8449' },
  purple: { lineColor: '#9b59b6', dotColor: '#9b59b6', bubbleColor: '#7d3c98' },
  orange: { lineColor: '#e67e22', dotColor: '#e67e22', bubbleColor: '#d35400' },
};

export default function ChartSettings({ settings, onChange }) {
  const [showColors, setShowColors] = useState(false);

  const handleChange = (field, value) => {
    onChange({ ...settings, [field]: value });
  };

  const applyPreset = (presetName) => {
    const preset = PRESET_THEMES[presetName];
    onChange({ ...settings, ...preset });
  };

  return (
    <div className="chart-settings">
      <div className="settings-row">
        <div className="setting-group">
          <label>Chart Title</label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter chart title"
          />
        </div>
        <div className="setting-group">
          <label>Line Style</label>
          <select
            value={settings.lineStyle}
            onChange={(e) => handleChange('lineStyle', e.target.value)}
          >
            <option value="curved">Curved</option>
            <option value="straight">Straight</option>
          </select>
        </div>
        <div className="setting-group">
          <label>Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => handleChange('theme', e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </div>

      <div className="settings-row">
        <div className="setting-group">
          <label>X-Axis Title</label>
          <input
            type="text"
            value={settings.xAxisTitle}
            onChange={(e) => handleChange('xAxisTitle', e.target.value)}
            placeholder="e.g., Month"
          />
        </div>
        <div className="setting-group">
          <label>Y-Axis Title</label>
          <input
            type="text"
            value={settings.yAxisTitle}
            onChange={(e) => handleChange('yAxisTitle', e.target.value)}
            placeholder="e.g., Revenue ($)"
          />
        </div>
        <div className="setting-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={settings.showGrid}
              onChange={(e) => handleChange('showGrid', e.target.checked)}
            />
            Show Grid
          </label>
        </div>
      </div>

      <div className="settings-row color-row">
        <button
          type="button"
          className="toggle-colors-btn"
          onClick={() => setShowColors(!showColors)}
        >
          {showColors ? '▼ Hide Colors' : '▶ Customize Colors'}
        </button>
        {!showColors && (
          <div className="color-presets">
            {Object.keys(PRESET_THEMES).map((preset) => (
              <button
                key={preset}
                type="button"
                className="preset-btn"
                style={{ backgroundColor: PRESET_THEMES[preset].lineColor }}
                onClick={() => applyPreset(preset)}
                title={preset}
              />
            ))}
          </div>
        )}
      </div>

      {showColors && (
        <div className="settings-row">
          <div className="setting-group">
            <label>Line Color</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={settings.lineColor}
                onChange={(e) => handleChange('lineColor', e.target.value)}
              />
              <input
                type="text"
                value={settings.lineColor}
                onChange={(e) => handleChange('lineColor', e.target.value)}
                className="color-text"
              />
            </div>
          </div>
          <div className="setting-group">
            <label>Dot Color</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={settings.dotColor}
                onChange={(e) => handleChange('dotColor', e.target.value)}
              />
              <input
                type="text"
                value={settings.dotColor}
                onChange={(e) => handleChange('dotColor', e.target.value)}
                className="color-text"
              />
            </div>
          </div>
          <div className="setting-group">
            <label>Bubble Color</label>
            <div className="color-input-wrapper">
              <input
                type="color"
                value={settings.bubbleColor}
                onChange={(e) => handleChange('bubbleColor', e.target.value)}
              />
              <input
                type="text"
                value={settings.bubbleColor}
                onChange={(e) => handleChange('bubbleColor', e.target.value)}
                className="color-text"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
