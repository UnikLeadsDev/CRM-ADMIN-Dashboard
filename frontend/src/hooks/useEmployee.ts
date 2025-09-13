import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { Employee } from '../types';

export const useEmployee = (employeeId?: string) => {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            if (!employeeId) {
                setEmployee(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const { data, error: supabaseError } = await supabase
                    .from('employees')
                    .select('*')
                    .eq('employee_id', employeeId)
                    .single();

                if (supabaseError) throw supabaseError;

                setEmployee(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setEmployee(null);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [employeeId]);

    return {
        employee,
        loading,
        error
    };
};