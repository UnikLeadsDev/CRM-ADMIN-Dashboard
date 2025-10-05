export interface Lead {
  id: number;
  date: string;
  name: string;
  phone: string;
  email: string;
  product: string;
  city: string;
  assigned_to: string;
  location: string;
  status: 'new_added' | 'contacted' | 'interested' | 'in_follow_up' | 'converted' | 'invalid' | 'not_interested';
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


export interface GeneratedLead {
  lead_id: string;
  full_name: string;
  mobile_number: string;
  email: string;
  product: string;
  loan_amount: string;
  pancard_number: string;
  aadhar_number: string;
  area_pincode: string;
  monthly_income: string;
  source_of_income: string;
  lead_type: 'Hot' | 'Warm' | 'Cold';
  lead_status: 'new_added' | 'in_follow_up' | 'interested' | 'not_interested' | 'converted' | 'invalid';
  referral_code: string;
  created_at: string; // ISO date string (e.g., "2025-09-25T07:10:06.000Z")
}
