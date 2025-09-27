-- Create channel_partners table in Supabase
-- CREATE TABLE IF NOT EXISTS channel_partners (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   phone VARCHAR(20),
--   company VARCHAR(255),
--   territory VARCHAR(255),
--   commission_rate DECIMAL(5,2) DEFAULT 0.00,
--   status VARCHAR(20) DEFAULT 'active',
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Add source column to unikleadsapi table if not exists
ALTER TABLE unikleadsapi 
ADD COLUMN IF NOT EXISTS source VARCHAR(20) DEFAULT 'manual';

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_channel_partners_status ON channel_partners(status);
CREATE INDEX IF NOT EXISTS idx_channel_partners_territory ON channel_partners(territory);
CREATE INDEX IF NOT EXISTS idx_unikleadsapi_source ON unikleadsapi(source);
CREATE INDEX IF NOT EXISTS idx_unikleadsapi_assigned ON unikleadsapi("Assigned to Lead Employee ID");
CREATE INDEX IF NOT EXISTS idx_unikleadsapi_status ON unikleadsapi(status);

CREATE TABLE IF NOT EXISTS partner_documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  partner_id INT,
  document_proof_type VARCHAR(100),
  document_number VARCHAR(100),
  front_side_url TEXT,
  back_side_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (partner_id) REFERENCES channel_partners(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS channel_partners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  application_reference_id VARCHAR(100),
  application_date DATE,
  application_ref_by VARCHAR(100),
  applicant_class VARCHAR(50),
  first_name VARCHAR(100),
  middle_name VARCHAR(100),
  last_name VARCHAR(100),
  father_name VARCHAR(100),
  date_of_birth DATE,
  gender VARCHAR(10),
  aadhar_number VARCHAR(12),
  pan_card_number VARCHAR(10),
  mobile_number VARCHAR(15),
  email_id VARCHAR(100),
  marital_status VARCHAR(20),
  spouse_name VARCHAR(100),
  mother_name VARCHAR(100),
  education VARCHAR(100),
  occupation VARCHAR(100),
  applicant_photo_url TEXT,
  current_address1 TEXT,
  current_pincode1 VARCHAR(10),
  current_state1 VARCHAR(50),
  current_district1 VARCHAR(50),
  current_city1 VARCHAR(50),
  current_locality1 VARCHAR(100),
  current_landmark1 VARCHAR(100),
  current_address2 TEXT,
  current_pincode2 VARCHAR(10),
  current_state2 VARCHAR(50),
  current_district2 VARCHAR(50),
  current_city2 VARCHAR(50),
  current_locality2 VARCHAR(100),
  current_landmark2 VARCHAR(100),
  permanent_address1 TEXT,
  permanent_pincode1 VARCHAR(10),
  permanent_state1 VARCHAR(50),
  permanent_district1 VARCHAR(50),
  permanent_city1 VARCHAR(50),
  permanent_locality1 VARCHAR(100),
  permanent_landmark1 VARCHAR(100),
  permanent_address2 TEXT,
  permanent_pincode2 VARCHAR(10),
  permanent_state2 VARCHAR(50),
  permanent_district2 VARCHAR(50),
  permanent_city2 VARCHAR(50),
  permanent_locality2 VARCHAR(100),
  permanent_landmark2 VARCHAR(100),
  bank_name VARCHAR(100),
  account_holder_name VARCHAR(100),
  bank_account_number VARCHAR(20),
  ifsc_code VARCHAR(11),
  branch_name VARCHAR(100),
  bank_account_type VARCHAR(20),
  final_decision VARCHAR(20),
  final_decision_reason TEXT,
  authorized_person_signature_url TEXT,
  digital_otp VARCHAR(10),
  uc_code VARCHAR(20),
  lc_code VARCHAR(20),
  authorized_person_name VARCHAR(100),
  authorized_person_designation VARCHAR(100),
  authorized_person_employee_id VARCHAR(50),
  approval_date DATE,
  applicant_details_status VARCHAR(20) DEFAULT 'Pending',
  applicant_details_reason TEXT,
  current_address_status VARCHAR(20) DEFAULT 'Pending',
  current_address_reason TEXT,
  permanent_address_status VARCHAR(20) DEFAULT 'Pending',
  permanent_address_reason TEXT,
  kyc_documents_status VARCHAR(20) DEFAULT 'Pending',
  kyc_documents_reason TEXT,
  banking_details_status VARCHAR(20) DEFAULT 'Pending',
  banking_details_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);