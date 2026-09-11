-- ==============================================================================
-- Shadhin Reseller BD: Supabase PostgreSQL Schema
-- Run this in your Supabase Project SQL Editor:
-- https://supabase.com/dashboard/project/otxnivolxzxrrtvklegj/sql/new
-- ==============================================================================

-- 1. App State table (used for complete application state sync & migration)
CREATE TABLE IF NOT EXISTS public.app_state (
  id TEXT PRIMARY KEY,
  payload JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.app_state ENABLE ROW LEVEL SECURITY;

-- Allow full backend access for service and anon keys
DROP POLICY IF EXISTS "Allow backend full access on app_state" ON public.app_state;
CREATE POLICY "Allow backend full access on app_state"
  ON public.app_state
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Optional: Create an index for fast lookups
CREATE INDEX IF NOT EXISTS idx_app_state_id ON public.app_state(id);
