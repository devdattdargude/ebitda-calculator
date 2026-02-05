-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- Scenarios table
CREATE TABLE scenarios (
  id UUID PRIMARY KEY,
  name TEXT,
  property TEXT,
  owner_id UUID,
  status TEXT DEFAULT 'DRAFT',
  approved_by UUID,
  approved_at TIMESTAMP,
  approval_comment TEXT,
  updated_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);

-- Scenario versions table
CREATE TABLE scenario_versions (
  id UUID PRIMARY KEY,
  scenario_id UUID,
  version_no INT,
  inputs JSONB,
  results JSONB,
  audit JSONB,
  created_at TIMESTAMP DEFAULT now()
);
