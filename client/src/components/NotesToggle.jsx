import React from 'react';

export default function NotesToggle({ showNotes, onToggle }) {
  return (
    <div className="toggle-container">
      <span>Show Notes</span>
      <div
        className={`toggle ${showNotes ? 'active' : ''}`}
        onClick={onToggle}
      >
        <div className="toggle-knob" />
      </div>
    </div>
  );
}
