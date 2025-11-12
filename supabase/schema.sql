-- Shift Registration System Database Schema
-- Run this SQL in Supabase SQL Editor: https://supabase.com/dashboard/project/wzgqvnuodmupsrlqjtyh/sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create shift_registrations table
CREATE TABLE IF NOT EXISTS shift_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  shift TEXT NOT NULL CHECK (shift IN ('Morning', 'Afternoon')),
  user_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(date, shift, user_name)
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  assigned_to TEXT,
  status TEXT NOT NULL DEFAULT 'not started' CHECK (status IN ('not started', 'in progress', 'completed')),
  deadline DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_shift_registrations_date_shift ON shift_registrations(date, shift);
CREATE INDEX IF NOT EXISTS idx_shift_registrations_date ON shift_registrations(date);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_deadline ON tasks(deadline);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to auto-update updated_at
CREATE TRIGGER update_shift_registrations_updated_at
  BEFORE UPDATE ON shift_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE shift_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for shift_registrations (allow all operations for now)
-- You can customize these based on your authentication needs
CREATE POLICY "Allow all operations on shift_registrations"
  ON shift_registrations
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create policies for tasks (allow all operations for now)
CREATE POLICY "Allow all operations on tasks"
  ON tasks
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create a view to get shift registrations grouped by date and shift
CREATE OR REPLACE VIEW shift_registrations_grouped AS
SELECT 
  date,
  shift,
  ARRAY_AGG(user_name ORDER BY created_at) as users,
  COUNT(*) as user_count
FROM shift_registrations
GROUP BY date, shift;

-- Add comments for documentation
COMMENT ON TABLE shift_registrations IS 'Stores individual shift registrations. Each row represents one user registering for a shift.';
COMMENT ON TABLE tasks IS 'Stores tasks with assignment, status, and deadline information.';
COMMENT ON VIEW shift_registrations_grouped IS 'Groups shift registrations by date and shift, showing all registered users as an array.';

