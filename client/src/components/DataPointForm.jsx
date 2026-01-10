import React, { useState, useEffect, useRef } from 'react';

export default function DataPointForm({ editingPoint, onSave, onCancel, onDelete, onBulkAdd }) {
  const [date, setDate] = useState('');
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');
  const [pasteMode, setPasteMode] = useState(false);
  const [pasteData, setPasteData] = useState('');
  const pasteRef = useRef(null);

  useEffect(() => {
    if (editingPoint) {
      setDate(editingPoint.month);
      setValue(editingPoint.value.toString());
      setNote(editingPoint.note || '');
      setPasteMode(false);
    } else {
      setDate('');
      setValue('');
      setNote('');
    }
  }, [editingPoint]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!date || value === '') return;
    onSave({
      month: date,
      value: parseFloat(value),
      note: note || null,
    });
    if (!editingPoint) {
      setDate('');
      setValue('');
      setNote('');
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData?.getData('text') || pasteData;
    if (!text) return;

    const lines = text.trim().split('\n');
    const points = [];

    for (const line of lines) {
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const [dateVal, valueVal, noteVal] = parts;
        const parsedValue = parseFloat(valueVal);
        if (dateVal && !isNaN(parsedValue)) {
          points.push({
            month: dateVal.trim(),
            value: parsedValue,
            note: noteVal?.trim() || null,
          });
        }
      }
    }

    if (points.length > 0) {
      onBulkAdd(points);
      setPasteData('');
      setPasteMode(false);
    }
  };

  const handlePasteAreaChange = (e) => {
    setPasteData(e.target.value);
  };

  const handlePasteSubmit = () => {
    if (pasteData) {
      handlePaste({ clipboardData: { getData: () => pasteData } });
    }
  };

  if (pasteMode) {
    return (
      <div className="form-container">
        <h2>Paste from Spreadsheet</h2>
        <p className="paste-hint">Paste data with columns: Date, Value, Note (tab-separated). Notes limited to 30 characters.</p>
        <textarea
          ref={pasteRef}
          className="paste-area"
          value={pasteData}
          onChange={handlePasteAreaChange}
          onPaste={handlePaste}
          placeholder="Paste spreadsheet data here (Date → Value → Note)"
          rows={6}
        />
        <div className="form-actions">
          <button type="button" className="primary" onClick={handlePasteSubmit}>
            Import Data
          </button>
          <button type="button" className="secondary" onClick={() => setPasteMode(false)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>{editingPoint ? 'Edit Data Point' : 'Add Data Point'}</h2>
        {!editingPoint && (
          <button type="button" className="paste-btn" onClick={() => setPasteMode(true)}>
            Paste from Spreadsheet
          </button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="form-group">
            <label>Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="e.g., Jan, Q1, 2024"
              required
            />
          </div>
          <div className="form-group">
            <label>Value</label>
            <input
              type="number"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="e.g., 1000"
              required
            />
          </div>
          <div className="form-group">
            <label>Note <span className="char-hint">(max 30 chars)</span></label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note (30 char limit)"
              maxLength={30}
            />
          </div>
        </div>
        <div className="form-actions">
          <button type="submit" className="primary">
            {editingPoint ? 'Update' : 'Add'}
          </button>
          {editingPoint && (
            <>
              <button type="button" className="secondary" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="button"
                className="danger"
                onClick={() => onDelete(editingPoint.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
