export interface Lead {
    'Assigned to Lead Employee ID': string;
    'Customer Name': string;
    'Mobile Number': string;
    'Product looking': string;
    'Type of Lead': string;
    'Customer City': string;
    'Email ID': string;
    'Date': string;
}

export interface Employee {
    employee_id: string;
    name: string;
    email: string;
}

export interface CSVRow {
    'Assigned to Lead Employee ID': string;
    'Customer Name': string;
    'Mobile Number': string;
    'Product looking': string;
    'Type of Lead': string;
    'Customer City': string;
    'Email ID': string;
    'Loan Amount'?: string;
}