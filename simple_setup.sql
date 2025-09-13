-- Create leads table without foreign key constraint
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id VARCHAR(255) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    product VARCHAR(255) NOT NULL,
    loan_amount DECIMAL(15,2) NOT NULL,
    lead_status VARCHAR(50) NOT NULL,
    assigned_employee_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);