-- Migration: Add property_requests table (Buscamos por Usted)
-- Date: 2026-02-14

-- Create property_requests table
CREATE TABLE IF NOT EXISTS property_requests (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  operation_type VARCHAR(50) NOT NULL,
  property_type VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  budget VARCHAR(100) NOT NULL,
  details TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  agency_id VARCHAR REFERENCES agencies(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for status lookup
CREATE INDEX IF NOT EXISTS idx_property_requests_status ON property_requests(status);

-- Create index for agency lookup
CREATE INDEX IF NOT EXISTS idx_property_requests_agency ON property_requests(agency_id);

-- Create index for date sorting
CREATE INDEX IF NOT EXISTS idx_property_requests_created ON property_requests(created_at DESC);
