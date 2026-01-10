import { supabase, isSupabaseConfigured } from './supabase';

// LocalStorage fallback for when Supabase is not configured
const LOCAL_STORAGE_POINTS_KEY = 'chart_notes_points';
const LOCAL_STORAGE_SETTINGS_KEY = 'chart_notes_settings';

function getLocalPoints() {
  const data = localStorage.getItem(LOCAL_STORAGE_POINTS_KEY);
  return data ? JSON.parse(data) : [];
}

function saveLocalPoints(points) {
  localStorage.setItem(LOCAL_STORAGE_POINTS_KEY, JSON.stringify(points));
}

function getLocalSettings() {
  const data = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
  return data ? JSON.parse(data) : null;
}

function saveLocalSettings(settings) {
  localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
}

let localNextId = Date.now();

// Points API
export async function getPoints() {
  if (!isSupabaseConfigured()) {
    return getLocalPoints();
  }
  const { data, error } = await supabase
    .from('data_points')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data;
}

export async function createPoint(point) {
  if (!isSupabaseConfigured()) {
    const points = getLocalPoints();
    const newPoint = {
      id: localNextId++,
      month: point.month,
      value: point.value,
      note: point.note || null,
      created_at: new Date().toISOString(),
    };
    points.push(newPoint);
    saveLocalPoints(points);
    return newPoint;
  }
  const { data, error } = await supabase
    .from('data_points')
    .insert([{
      month: point.month,
      value: point.value,
      note: point.note || null,
    }])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updatePoint(id, point) {
  if (!isSupabaseConfigured()) {
    const points = getLocalPoints();
    const index = points.findIndex(p => p.id === id);
    if (index !== -1) {
      points[index] = { ...points[index], ...point };
      saveLocalPoints(points);
      return points[index];
    }
    throw new Error('Point not found');
  }
  const { data, error } = await supabase
    .from('data_points')
    .update({
      month: point.month,
      value: point.value,
      note: point.note,
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deletePoint(id) {
  if (!isSupabaseConfigured()) {
    const points = getLocalPoints();
    const filtered = points.filter(p => p.id !== id);
    saveLocalPoints(filtered);
    return;
  }
  const { error } = await supabase
    .from('data_points')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function clearAllPoints() {
  if (!isSupabaseConfigured()) {
    saveLocalPoints([]);
    return;
  }
  const { error } = await supabase
    .from('data_points')
    .delete()
    .neq('id', 0); // Delete all rows
  if (error) throw error;
}

// Settings API
export async function getSettings() {
  if (!isSupabaseConfigured()) {
    return getLocalSettings();
  }
  const { data, error } = await supabase
    .from('chart_settings')
    .select('*')
    .limit(1)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
}

export async function saveSettings(settings) {
  if (!isSupabaseConfigured()) {
    saveLocalSettings(settings);
    return settings;
  }
  // Upsert - update if exists, insert if not
  const { data: existing } = await supabase
    .from('chart_settings')
    .select('id')
    .limit(1)
    .single();

  if (existing) {
    const { data, error } = await supabase
      .from('chart_settings')
      .update(settings)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } else {
    const { data, error } = await supabase
      .from('chart_settings')
      .insert([settings])
      .select()
      .single();
    if (error) throw error;
    return data;
  }
}
