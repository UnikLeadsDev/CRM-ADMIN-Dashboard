export interface Lead {
  id: number;
  date: string;
  name: string;
  phone: string;
  email: string;
  product: string;
  city: string;
  assigned_to: string;
  status: 'open' | 'in_process' | 'closed' | 'not_interested';
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