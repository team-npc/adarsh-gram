-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types
CREATE TYPE user_role AS ENUM (
  'system_admin',
  'district_admin', 
  'block_officer',
  'village_reporter',
  'assessor',
  'viewer'
);

CREATE TYPE login_type AS ENUM ('internal', 'google_oauth');

CREATE TYPE village_status AS ENUM (
  'registered',
  'under_assessment', 
  'in_development',
  'adarsh_gram'
);

CREATE TYPE focus_area AS ENUM (
  'education',
  'healthcare',
  'sanitation',
  'connectivity',
  'drinking_water',
  'electricity',
  'skill_development',
  'livelihood'
);

CREATE TYPE gap_level AS ENUM ('critical', 'moderate', 'minor', 'adequate');
CREATE TYPE assessment_status AS ENUM ('draft', 'completed', 'reviewed');
CREATE TYPE project_status AS ENUM ('planned', 'in_progress', 'completed', 'delayed');
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE problem_status AS ENUM ('pending', 'under_review', 'in_progress', 'resolved', 'rejected');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  firebase_uid VARCHAR(255) UNIQUE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  role user_role NOT NULL,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  block VARCHAR(100),
  village VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  email_verified BOOLEAN DEFAULT false,
  two_factor_enabled BOOLEAN DEFAULT false,
  login_type login_type NOT NULL DEFAULT 'internal',
  
  CONSTRAINT check_auth_method CHECK (
    (login_type = 'internal' AND password_hash IS NOT NULL AND firebase_uid IS NULL) OR
    (login_type = 'google_oauth' AND firebase_uid IS NOT NULL AND password_hash IS NULL)
  )
);

-- Password reset tokens table
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens table
CREATE TABLE refresh_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  revoked BOOLEAN DEFAULT false
);

-- Villages table
CREATE TABLE villages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  block VARCHAR(100) NOT NULL,
  pincode VARCHAR(10) NOT NULL,
  total_population INTEGER NOT NULL CHECK (total_population > 0),
  sc_population INTEGER NOT NULL CHECK (sc_population >= 0),
  sc_percentage DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN total_population > 0 THEN (sc_population::DECIMAL / total_population::DECIMAL) * 100
      ELSE 0
    END
  ) STORED,
  is_eligible BOOLEAN GENERATED ALWAYS AS (sc_percentage >= 50.0) STORED,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  registration_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status village_status DEFAULT 'registered',
  
  CONSTRAINT check_sc_population CHECK (sc_population <= total_population),
  CONSTRAINT unique_village_location UNIQUE (name, district, block)
);

-- Assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
  assessor_id UUID NOT NULL REFERENCES users(id),
  focus_area focus_area NOT NULL,
  overall_score DECIMAL(5,2) NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  gap_level gap_level NOT NULL,
  recommendations TEXT[],
  supporting_documents TEXT[],
  assessment_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status assessment_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT unique_village_focus_area UNIQUE (village_id, focus_area)
);

-- Assessment criteria table
CREATE TABLE assessment_criteria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  criterion VARCHAR(500) NOT NULL,
  score DECIMAL(5,2) NOT NULL CHECK (score >= 0),
  max_score DECIMAL(5,2) NOT NULL CHECK (max_score > 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_score_range CHECK (score <= max_score)
);

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
  name VARCHAR(300) NOT NULL,
  focus_area VARCHAR(100) NOT NULL,
  description TEXT,
  budget DECIMAL(15,2) CHECK (budget >= 0),
  start_date DATE NOT NULL,
  expected_end_date DATE NOT NULL,
  actual_end_date DATE,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
  status project_status DEFAULT 'planned',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_dates CHECK (expected_end_date >= start_date),
  CONSTRAINT check_actual_end_date CHECK (actual_end_date IS NULL OR actual_end_date >= start_date)
);

-- Project milestones table
CREATE TABLE project_milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  target_date DATE NOT NULL,
  completed_date DATE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT check_milestone_completion CHECK (
    (is_completed = true AND completed_date IS NOT NULL) OR
    (is_completed = false AND completed_date IS NULL)
  )
);

-- Problem reports table
CREATE TABLE problem_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES users(id),
  village_id UUID NOT NULL REFERENCES villages(id) ON DELETE CASCADE,
  title VARCHAR(300) NOT NULL,
  description TEXT NOT NULL,
  category focus_area NOT NULL,
  latitude DECIMAL(10,8) NOT NULL,
  longitude DECIMAL(11,8) NOT NULL,
  address TEXT NOT NULL,
  priority priority_level DEFAULT 'medium',
  status problem_status DEFAULT 'pending',
  attachments TEXT[],
  reported_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  assigned_to UUID REFERENCES users(id),
  resolution_notes TEXT
);

-- Audit log table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  table_name VARCHAR(100) NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_firebase_uid ON users(firebase_uid);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_location ON users(state, district, block, village);

CREATE INDEX idx_villages_location ON villages(state, district, block);
CREATE INDEX idx_villages_status ON villages(status);
CREATE INDEX idx_villages_eligible ON villages(is_eligible);
CREATE INDEX idx_villages_coordinates ON villages(latitude, longitude);

CREATE INDEX idx_assessments_village ON assessments(village_id);
CREATE INDEX idx_assessments_assessor ON assessments(assessor_id);
CREATE INDEX idx_assessments_focus_area ON assessments(focus_area);
CREATE INDEX idx_assessments_status ON assessments(status);

CREATE INDEX idx_projects_village ON projects(village_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_dates ON projects(start_date, expected_end_date);

CREATE INDEX idx_problem_reports_reporter ON problem_reports(reporter_id);
CREATE INDEX idx_problem_reports_village ON problem_reports(village_id);
CREATE INDEX idx_problem_reports_status ON problem_reports(status);
CREATE INDEX idx_problem_reports_category ON problem_reports(category);
CREATE INDEX idx_problem_reports_location ON problem_reports(latitude, longitude);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_villages_updated_at BEFORE UPDATE ON villages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_problem_reports_updated_at BEFORE UPDATE ON problem_reports
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();