-- Insert sample employees for testing
INSERT INTO employees (employee_id, name, email) VALUES
('EMP001', 'Alice Johnson', 'alice.johnson@company.com'),
('EMP002', 'Bob Smith', 'bob.smith@company.com'),
('EMP003', 'Carol Davis', 'carol.davis@company.com')
ON CONFLICT (employee_id) DO NOTHING;