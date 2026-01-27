-- Create table for storing live dashboard state
CREATE TABLE IF NOT EXISTS live_dashboard_state (
  id INT PRIMARY KEY DEFAULT 1,
  data JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert initial empty row (id always 1)
INSERT INTO live_dashboard_state (id, data)
VALUES (1, '{
  "live_actuel": {
    "places_disponibles": 0,
    "places_prises": 0,
    "places_restantes": 0,
    "duree_live_minutes": 0
  },
  "ventes": [],
  "stats": {
    "total_gains": 0,
    "total_ventes": 0
  }
}'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security
ALTER TABLE live_dashboard_state ENABLE ROW LEVEL SECURITY;

-- Allow public read access (dashboard needs to read this)
CREATE POLICY "Allow public read" ON live_dashboard_state FOR SELECT USING (true);

-- Allow updates (we will use service role key in API, so this is just a fallback/safety)
CREATE POLICY "Allow service role update" ON live_dashboard_state FOR ALL USING (true);
