# Product Requirements Document (PRD)
## Chart Notes App

**Version:** 1.0
**Date:** January 2026
**Status:** Released

---

## 1. Overview

### 1.1 Problem Statement
Users need a simple way to create time-series charts with contextual notes attached to specific data points. Existing charting tools either lack annotation features or are overly complex for quick visualizations.

### 1.2 Solution
Chart Notes App is a lightweight web application that allows users to:
- Create line charts with custom time labels
- Attach notes to data points displayed as speech bubbles
- Export annotated charts as images for presentations and reports

### 1.3 Target Users
- Business analysts creating quick data visualizations
- Product managers tracking metrics with context
- Anyone needing annotated charts without complex tools

---

## 2. Features

### 2.1 Core Features (MVP)

| Feature | Description | Status |
|---------|-------------|--------|
| Line Chart | Display data as a line chart with clickable points | Done |
| Note Bubbles | Speech bubble annotations pointing to data points | Done |
| Toggle Notes | Show/hide all notes with a switch | Done |
| CRUD Operations | Add, edit, delete data points | Done |
| Data Persistence | Save data to database | Done |

### 2.2 Enhanced Features (v1.0)

| Feature | Description | Status |
|---------|-------------|--------|
| Free-form Dates | Any text for X-axis (Jan, Q1, Week 1, etc.) | Done |
| Spreadsheet Paste | Paste tab-separated data from Excel/Sheets | Done |
| Inline Editing | Click cells in data table to edit | Done |
| Color Customization | Pick line, dot, bubble colors | Done |
| Color Presets | One-click theme presets (5 options) | Done |
| Dark Mode | Full dark theme for app and chart | Done |
| Grid Toggle | Show/hide chart grid lines | Done |
| Chart Title | Customizable chart title | Done |
| Axis Titles | Optional X and Y axis labels | Done |
| Line Style | Curved or straight line option | Done |
| PNG Export | Download chart as image | Done |
| Auto-Save Settings | Settings persist automatically | Done |
| Cloud Sync | Data syncs via Supabase | Done |
| Clear All | Reset all data with confirmation | Done |

### 2.3 Future Features (Backlog)

| Feature | Description | Priority |
|---------|-------------|----------|
| Multiple Charts | Save/load different charts | High |
| Multiple Series | 2-3 lines on same chart | High |
| Drag to Reorder | Reorder data points by dragging | Medium |
| Undo/Redo | Revert accidental changes | Medium |
| CSV Import/Export | File-based data transfer | Medium |
| Y-axis Formatting | Currency, percentage, compact | Medium |
| Keyboard Shortcuts | Enter to add, Escape to cancel | Low |
| Responsive Design | Better mobile support | Low |
| User Authentication | Per-user data isolation | Low |

---

## 3. Technical Requirements

### 3.1 Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Charting:** Recharts
- **Image Export:** html-to-image
- **Styling:** Plain CSS with CSS variables

### 3.2 Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** None (public access)
- **API:** Supabase REST API

### 3.3 Infrastructure
- **Hosting:** GitHub Pages (static)
- **CI/CD:** GitHub Actions
- **Domain:** github.io subdomain

### 3.4 Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 4. Data Model

### 4.1 Data Points Table
```sql
data_points (
  id BIGSERIAL PRIMARY KEY,
  month TEXT NOT NULL,        -- X-axis label (any text)
  value NUMERIC NOT NULL,     -- Y-axis value
  note TEXT,                  -- Optional note (max 30 chars recommended)
  created_at TIMESTAMPTZ      -- For ordering
)
```

### 4.2 Settings Table
```sql
chart_settings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT,                 -- Chart title
  line_style TEXT,            -- 'curved' or 'straight'
  x_axis_title TEXT,          -- X-axis label
  y_axis_title TEXT,          -- Y-axis label
  line_color TEXT,            -- Hex color
  dot_color TEXT,             -- Hex color
  bubble_color TEXT,          -- Hex color
  theme TEXT,                 -- 'light' or 'dark'
  show_grid BOOLEAN           -- Grid visibility
)
```

---

## 5. User Interface

### 5.1 Layout
```
+--------------------------------------------------+
|  Chart Notes                                      |
+--------------------------------------------------+
|  [Show Notes] [Export PNG] [Clear All]           |
|  +----------------------------------------------+|
|  | Settings: Title | Style | Theme              ||
|  |           X-Axis | Y-Axis | Grid             ||
|  |           Colors (expandable)                ||
|  +----------------------------------------------+|
|  |                                              ||
|  |              LINE CHART                      ||
|  |         with bubble annotations              ||
|  |                                              ||
|  +----------------------------------------------+|
+--------------------------------------------------+
|  Add Data Point                                  |
|  [Date] [Value] [Note (30 chars)]  [Add]        |
+--------------------------------------------------+
|  Data Points (click to edit)                     |
|  Date    | Value  | Note           | Delete     |
|  Jan     | 500    | Launch day     |   x        |
|  Feb     | 1200   | Growth month   |   x        |
+--------------------------------------------------+
```

### 5.2 Interactions
- **Click chart point:** Opens edit form for that point
- **Click table cell:** Inline edit mode
- **Enter key:** Save inline edit
- **Escape key:** Cancel inline edit
- **Toggle switch:** Show/hide notes on chart

---

## 6. Constraints

### 6.1 Note Length
- **Limit:** 30 characters
- **Reason:** Bubbles must fit on chart without overlap
- **Truncation:** Notes > 30 chars show as "text..."

### 6.2 Data Points
- **Soft limit:** ~50 points for optimal readability
- **No hard limit:** Performance may degrade with 100+ points

### 6.3 Export
- **Format:** PNG only (2x resolution)
- **Includes:** Chart, title, notes (if visible)
- **Excludes:** Settings panel, data table

---

## 7. Success Metrics

| Metric | Target |
|--------|--------|
| Page Load Time | < 2 seconds |
| Chart Render | < 500ms |
| Export Time | < 3 seconds |
| Mobile Usable | Basic functionality works |

---

## 8. Release History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial release with all v1 features |

