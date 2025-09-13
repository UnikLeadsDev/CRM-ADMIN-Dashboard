import { supabase } from '../config/supabase';

async function setupDatabase() {
    try {
        // Insert employees
        const employees = [
            { employee_id: 'EMP001', name: 'Alice Johnson', email: 'alice.johnson@company.com' },
            { employee_id: 'EMP002', name: 'Bob Smith', email: 'bob.smith@company.com' },
            { employee_id: 'EMP003', name: 'Carol Davis', email: 'carol.davis@company.com' },
            { employee_id: 'EMP004', name: 'David Wilson', email: 'david.wilson@company.com' },
            { employee_id: 'EMP005', name: 'Emma Brown', email: 'emma.brown@company.com' }
        ];

        const { error } = await supabase
            .from('employees')
            .upsert(employees, { onConflict: 'employee_id' });

        if (error) {
            console.error('Error inserting employees:', error);
        } else {
            console.log('Employees inserted successfully');
        }

        // Check existing employees
        const { data: existingEmployees } = await supabase
            .from('employees')
            .select('employee_id, name');

        console.log('Current employees:', existingEmployees);
    } catch (error) {
        console.error('Error:', error);
    }
}

setupDatabase();