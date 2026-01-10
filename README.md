# Chart Notes App

A simple, elegant time-series chart application with annotated data points. Create line charts with note bubbles that highlight key moments in your data.

![Chart Notes App](https://img.shields.io/badge/status-live-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![Supabase](https://img.shields.io/badge/Supabase-backend-green)

**Live Demo:** [https://davesuzuki-hiya.github.io/chart-notes-app/](https://davesuzuki-hiya.github.io/chart-notes-app/)

## Features

- **Time Series Charts** - Plot data with custom date labels (Jan, Feb, Q1, 2024, etc.)
- **Note Bubbles** - Add notes to data points displayed as speech bubbles with pointers
- **Toggle Notes** - Show/hide notes with a single click
- **Inline Editing** - Click any value in the data table to edit directly
- **Spreadsheet Paste** - Copy from Excel/Google Sheets and paste directly
- **Color Customization** - Pick line, dot, and bubble colors or use preset themes
- **Dark Mode** - Full light/dark theme support
- **Export PNG** - Download your chart as a high-resolution image
- **Auto-Save** - All settings persist automatically
- **Cloud Storage** - Data syncs across devices via Supabase

## Tech Stack

- **Frontend:** React 18 + Vite
- **Charting:** Recharts
- **Database:** Supabase (PostgreSQL)
- **Hosting:** GitHub Pages
- **CI/CD:** GitHub Actions

## Quick Start

### Local Development (No Backend)

```bash
cd client
npm install
npm run dev
```

The app will use localStorage when Supabase is not configured.

### Local Development (With Supabase)

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL from `SETUP.md` to create tables
3. Copy your credentials:

```bash
cd client
cp .env.example .env
# Edit .env with your Supabase URL and anon key
npm run dev
```

## Project Structure

```
chart-notes-app/
├── client/                    # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Chart.jsx          # Main chart with Recharts
│   │   │   ├── ChartSettings.jsx  # Settings panel
│   │   │   ├── DataPointForm.jsx  # Add/edit form
│   │   │   ├── DataPointsList.jsx # Inline editable table
│   │   │   └── NotesToggle.jsx    # Show/hide toggle
│   │   ├── api.js             # API layer (Supabase + localStorage)
│   │   ├── supabase.js        # Supabase client
│   │   ├── App.jsx            # Main app component
│   │   └── styles.css         # All styles including dark mode
│   └── package.json
├── server/                    # Local dev server (optional)
├── .github/workflows/         # GitHub Actions deployment
├── SETUP.md                   # Deployment guide
├── PRD.md                     # Product requirements
└── PROJECT_NOTES.md           # Development notes
```

## Deployment

The app auto-deploys to GitHub Pages on every push to `main`.

To deploy your own instance, see [SETUP.md](./SETUP.md).

## Usage Tips

- **Add Data:** Enter date, value, and optional note (max 30 chars)
- **Bulk Import:** Click "Paste from Spreadsheet" for multi-row import
- **Edit Inline:** Click any cell in the data table to edit
- **Color Presets:** Click the colored circles for quick theme changes
- **Export:** Use "Export PNG" with notes visible for annotated charts

## License

MIT
