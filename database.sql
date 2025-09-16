-- Create channel_partners table in Supabase
CREATE TABLE IF NOT EXISTS channel_partners (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  company VARCHAR(255),
  territory VARCHAR(255),
  commission_rate DECIMAL(5,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add source column to unikleadsapi table if not exists
ALTER TABLE unikleadsapi 
ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'manual';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_channel_partners_status ON channel_partners(status);
CREATE INDEX IF NOT EXISTS idx_channel_partners_territory ON channel_partners(territory);
CREATE INDEX IF NOT EXISTS idx_unikleadsapi_source ON unikleadsapi(source);
CREATE INDEX IF NOT EXISTS idx_unikleadsapi_assigned ON unikleadsapi("Assigned to Lead Employee ID");
CREATE INDEX IF NOT EXISTS idx_unikleadsapi_status ON unikleadsapi(status);