-- Migration: Add building units support
-- Date: 2026-01-27

-- Add new columns to properties table for building units support
ALTER TABLE properties 
  ADD COLUMN IF NOT EXISTS covered_area INTEGER,
  ADD COLUMN IF NOT EXISTS unit_identifier VARCHAR(50),
  ADD COLUMN IF NOT EXISTS rent_price DECIMAL(12, 2),
  ADD COLUMN IF NOT EXISTS parent_property_id VARCHAR;

-- Create index for parent property lookup
CREATE INDEX IF NOT EXISTS idx_properties_parent ON properties(parent_property_id);

-- Add the "Edificio" category if it doesn't exist
INSERT INTO property_categories (id, name, slug, description, created_at) 
SELECT 
  gen_random_uuid(), 
  'Edificio', 
  'edificio', 
  'Edificios con múltiples unidades', 
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM property_categories WHERE slug = 'edificio'
);
