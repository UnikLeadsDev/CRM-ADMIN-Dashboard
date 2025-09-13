-- Create employees table
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id VARCHAR(255) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    product VARCHAR(255) NOT NULL,
    loan_amount DECIMAL(15,2) NOT NULL,
    lead_status VARCHAR(50) NOT NULL,
    assigned_employee_id VARCHAR(255) REFERENCES employees(employee_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_mobile_number ON leads(mobile_number);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_employee ON leads(assigned_employee_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(lead_status);

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_employees_updated_at ON employees;
CREATE TRIGGER update_employees_updated_at
    BEFORE UPDATE ON employees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample employees
INSERT INTO employees (employee_id, name, email) VALUES
('EMP001', 'Alice Johnson', 'alice.johnson@company.com'),
('EMP002', 'Bob Smith', 'bob.smith@company.com'),
('EMP003', 'Carol Davis', 'carol.davis@company.com'),
('EMP004', 'David Wilson', 'david.wilson@company.com'),
('EMP005', 'Emma Brown', 'emma.brown@company.com')
ON CONFLICT (employee_id) DO NOTHING;