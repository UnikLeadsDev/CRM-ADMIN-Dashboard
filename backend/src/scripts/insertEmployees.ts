import { supabase } from '../config/supabase';

async function insertSampleEmployees() {
    try {
        const employees = [
            { employee_id: 'EMP001', name: 'Alice Johnson', email: 'alice.johnson@company.com' },
            { employee_id: 'EMP002', name: 'Bob Smith', email: 'bob.smith@company.com' },
            { employee_id: 'EMP003', name: 'Carol Davis', email: 'carol.davis@company.com' }
        ];

        const { data, error } = await supabase
            .from('employees')
            .upsert(employees, { onConflict: 'employee_id' });

        if (error) {
            console.error('Error inserting employees:', error);
            return;
        }

        console.log('Sample employees inserted successfully:', data);
    } catch (error) {
        console.error('Error:', error);
    }
}

insertSampleEmployees();