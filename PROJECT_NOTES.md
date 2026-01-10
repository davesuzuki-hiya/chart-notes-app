# Project Notes
## Chart Notes App - Development Reference

---

## Architecture Decisions

### Why Supabase over SQLite?
- **Original plan:** Node.js + Express + SQLite (better-sqlite3)
- **Problem:** better-sqlite3 failed to compile on Node.js 25 (native bindings)
- **Solution:** Switched to Supabase for cloud PostgreSQL
- **Benefit:** No backend server to manage, works with static hosting

### Why localStorage Fallback?
- Allows local development without Supabase setup
- App works offline (data stays in browser)
- Graceful degradation if Supabase credentials missing

### Why Recharts?
- React-native charting library
- Good support for custom components (bubbles)
- `Customized` component allows full SVG access for note bubbles

---

## Key Implementation Details

### Note Bubble Positioning
**File:** `client/src/components/Chart.jsx`

The bubbles use Recharts' `Customized` component to access axis scales:

```jsx
function NoteBubbles({ data, xAxisMap, yAxisMap, bubbleColor, width }) {
  const xAxis = Object.values(xAxisMap)[0];
  const yAxis = Object.values(yAxisMap)[0];

  // Get pixel coordinates from data values
  const cx = xAxis.scale(point.month);
  const cy = yAxis.scale(point.value);

  // Adjust position to prevent edge clipping
  if (bubbleX + bubbleWidth > chartWidth - 10) {
    bubbleX = chartWidth - bubbleWidth - 10;
  }
}
```

**Edge case handling:**
- Bubbles near right edge shift left
- Pointer still points to correct data point
- Extra margin added when notes visible (80px vs 30px)

### Auto-Save with Debounce
**File:** `client/src/App.jsx`

Settings auto-save with 500ms debounce to prevent excessive API calls:

```jsx
const debouncedSaveSettings = useCallback((newSettings) => {
  if (saveTimeoutRef.current) {
    clearTimeout(saveTimeoutRef.current);
  }
  saveTimeoutRef.current = setTimeout(() => {
    saveSettings(newSettings);
  }, 500);
}, []);
```

### Spreadsheet Paste Parsing
**File:** `client/src/components/DataPointForm.jsx`

Handles tab-separated values from Excel/Google Sheets:

```jsx
const handlePaste = (e) => {
  const text = e.clipboardData?.getData('text');
  const lines = text.trim().split('\n');

  for (const line of lines) {
    const parts = line.split('\t');  // Tab separator
    const [dateVal, valueVal, noteVal] = parts;
    // ... validate and add
  }
};
```

### Dark Mode Implementation
Uses CSS class-based theming:

```css
.app.dark { background: #121212; }
.chart-container.dark { background: #1e1e1e; }
.chart-export-area.dark { background: #1a1a2e; }
```

Chart colors adapt via props:
```jsx
const axisStyle = isDark ? { fill: '#e0e0e0' } : { fill: '#666' };
const gridColor = isDark ? '#444' : '#e0e0e0';
```

---

## File Structure Reference

```
client/src/
├── App.jsx              # Main app, state management, API calls
├── api.js               # Supabase + localStorage API layer
├── supabase.js          # Supabase client init
├── styles.css           # All styles (400+ lines)
├── index.jsx            # React entry point
└── components/
    ├── Chart.jsx        # Recharts + NoteBubbles
    ├── ChartSettings.jsx # Title, colors, theme, grid
    ├── DataPointForm.jsx # Add/edit form + paste
    ├── DataPointsList.jsx # Inline editable table
    └── NotesToggle.jsx   # Simple toggle switch
```

---

## Supabase Schema

```sql
-- Data points table
CREATE TABLE data_points (
  id BIGSERIAL PRIMARY KEY,
  month TEXT NOT NULL,
  value NUMERIC NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Settings table (single row)
CREATE TABLE chart_settings (
  id BIGSERIAL PRIMARY KEY,
  title TEXT DEFAULT '',
  line_style TEXT DEFAULT 'curved',
  x_axis_title TEXT DEFAULT '',
  y_axis_title TEXT DEFAULT '',
  line_color TEXT DEFAULT '#3498db',
  dot_color TEXT DEFAULT '#3498db',
  bubble_color TEXT DEFAULT '#333333',
  theme TEXT DEFAULT 'light',
  show_grid BOOLEAN DEFAULT true
);

-- Row Level Security (public access)
ALTER TABLE data_points ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public" ON data_points FOR ALL USING (true);
```

---

## Common Issues & Solutions

### Issue: Bubbles cut off at edges
**Solution:** Added smart positioning in `NoteBubbles` component that shifts bubbles away from edges while keeping pointer at data point.

### Issue: PNG export missing bubbles
**Solution:** Added `overflow: visible` to chart containers and increased margins.

### Issue: GitHub Actions can't push workflow file
**Solution:** Need `workflow` scope on GitHub token. Run:
```bash
gh auth refresh -h github.com -s workflow
```

### Issue: Vite shows blank page
**Solution:** Clear Vite cache:
```bash
rm -rf node_modules/.vite
npm run dev
```

### Issue: Supabase "no rows" error
**Solution:** Handle PGRST116 error code (no rows returned):
```js
if (error && error.code !== 'PGRST116') throw error;
```

---

## Environment Variables

```bash
# .env (client)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# GitHub Secrets (for deployment)
VITE_SUPABASE_URL      # Same as above
VITE_SUPABASE_ANON_KEY # Same as above
```

---

## Deployment Checklist

1. [ ] Supabase project created
2. [ ] Tables created with SQL
3. [ ] RLS policies added
4. [ ] GitHub repo created
5. [ ] Secrets added (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
6. [ ] GitHub Pages enabled (Source: GitHub Actions)
7. [ ] Push to main branch
8. [ ] Verify deployment at github.io URL

---

## Performance Notes

- **Bundle size:** ~530KB (mostly Recharts)
- **Could optimize:** Code-split Recharts with dynamic import
- **Image export:** Uses 2x pixel ratio for crisp images
- **Debounce:** 500ms for settings auto-save

---

## Testing Checklist

- [ ] Add single data point
- [ ] Add via spreadsheet paste
- [ ] Edit inline in table
- [ ] Delete data point
- [ ] Clear all data
- [ ] Toggle notes on/off
- [ ] Change colors (picker + presets)
- [ ] Switch dark/light mode
- [ ] Toggle grid
- [ ] Change line style
- [ ] Add chart title
- [ ] Add axis titles
- [ ] Export PNG (with notes visible)
- [ ] Refresh page (data persists)
- [ ] Open in new browser (data syncs)

---

## Future Development Notes

### For Multiple Charts Feature
- Add `chart_id` to data_points table
- Create `charts` table with chart metadata
- Add chart selector dropdown in UI

### For User Authentication
- Enable Supabase Auth
- Update RLS policies to filter by user_id
- Add login/signup UI

### For Multiple Data Series
- Add `series` column to data_points
- Support multiple `<Line>` components in chart
- Add legend component
- Color picker per series
