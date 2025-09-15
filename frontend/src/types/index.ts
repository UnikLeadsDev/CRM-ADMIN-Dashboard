export interface Lead {
    id?: string;
    'Assigned to Lead Employee ID': string;
    'Customer Name': string;
    'Mobile Number': string;
    'Product looking': string;
    'Type of Lead': string;
    'Customer City': string;
    'Email ID': string;
    'Date': string;
    status: 'open' | 'in_process' | 'closed' | 'not_interested';
    assigned_at?: string;
}

export interface LeadAssignment {
    employee_id: string;
    lead_count: number;
    leads: Lead[];
}

export interface Employee {
    id: string;
    employee_id: string;
    name: string;
    email: string;
    created_at: string;
    updated_at: string;
}