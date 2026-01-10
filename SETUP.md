# Chart Notes App - Deployment Guide

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter project name (e.g., "chart-notes")
4. Set a database password (save it somewhere safe)
5. Select a region close to you
6. Click "Create new project" and wait for setup

## Step 2: Create Database Tables

In your Supabase dashboard, go to **SQL Editor** and run this SQL:

```sql
-- Create data_points table
CREATE TABLE data_points (
  id BIGSERIAL PRIMARY KEY,
  month TEXT NOT NULL,
  value NUMERIC NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create chart_settings table
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
  show_grid BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (optional - for public access, disable it)
ALTER TABLE data_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE chart_settings ENABLE ROW LEVEL SECURITY;

-- Allow public access (for a simple app without auth)
CREATE POLICY "Allow public read" ON data_points FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON data_points FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON data_points FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON data_points FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON chart_settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON chart_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON chart_settings FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON chart_settings FOR DELETE USING (true);
```

## Step 3: Get Supabase Credentials

1. In Supabase dashboard, go to **Settings** > **API**
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy the **anon public** key (under Project API keys)

## Step 4: Create GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it `chart-notes-app` (or any name - update vite.config.js base path to match)
3. Keep it public (required for free GitHub Pages)

## Step 5: Add GitHub Secrets

In your GitHub repo:
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click "New repository secret"
3. Add these secrets:
   - `VITE_SUPABASE_URL` = your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

## Step 6: Enable GitHub Pages

1. Go to repo **Settings** > **Pages**
2. Under "Build and deployment", select **Source**: "GitHub Actions"

## Step 7: Push Code to GitHub

```bash
cd chart-notes-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/chart-notes-app.git
git push -u origin main
```

## Step 8: Wait for Deployment

1. Go to your repo's **Actions** tab
2. Watch the "Deploy to GitHub Pages" workflow
3. Once complete, your app will be at:
   `https://YOUR_USERNAME.github.io/chart-notes-app/`

---

## Local Development

To run locally without Supabase (uses localStorage):

```bash
cd client
npm install
npm run dev
```

To run locally with Supabase:

```bash
cd client
cp .env.example .env
# Edit .env with your Supabase credentials
npm run dev
```

---

## Updating the App

Just push changes to the `main` branch - GitHub Actions will automatically rebuild and deploy.
