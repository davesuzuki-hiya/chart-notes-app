import React, { useState } from 'react';

function EditableCell({ value, onSave, type = 'text' }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  const handleSave = () => {
    setEditing(false);
    if (editValue !== value) {
      onSave(type === 'number' ? parseFloat(editValue) : editValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setEditing(false);
    }
  };

  if (editing) {
    return (
      <input
        type={type}
        className="inline-edit-input"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    );
  }

  return (
    <span
      className="editable-cell"
      onClick={() => {
        setEditValue(value);
        setEditing(true);
      }}
      title="Click to edit"
    >
      {value || <em className="empty-value">empty</em>}
    </span>
  );
}

export default function DataPointsList({ points, onUpdate, onDelete }) {
  if (points.length === 0) return null;

  const handleFieldUpdate = (point, field, value) => {
    onUpdate(point.id, { ...point, [field]: value });
  };

  return (
    <div className="points-list">
      <h3>Data Points <span className="edit-hint">(click to edit)</span></h3>
      <div className="points-table">
        <div className="points-header">
          <span>Date</span>
          <span>Value</span>
          <span>Note</span>
          <span></span>
        </div>
        {points.map((point) => (
          <div key={point.id} className="points-row">
            <EditableCell
              value={point.month}
              onSave={(v) => handleFieldUpdate(point, 'month', v)}
            />
            <EditableCell
              value={point.value}
              type="number"
              onSave={(v) => handleFieldUpdate(point, 'value', v)}
            />
            <EditableCell
              value={point.note || ''}
              onSave={(v) => handleFieldUpdate(point, 'note', v || null)}
            />
            <button
              className="delete-row-btn"
              onClick={() => onDelete(point.id)}
              title="Delete"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
