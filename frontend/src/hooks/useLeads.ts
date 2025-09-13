import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import type { Lead } from '../types';

export const useLeads = (employeeId?: string) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                let query = supabase.from('unikleadsapi').select('*');
                
                if (employeeId) {
                    query = query.eq('Assigned to Lead Employee ID', employeeId);
                }

                const { data, error: supabaseError } = await query;

                if (supabaseError) throw supabaseError;

                setLeads(data || []);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchLeads();

        // No real-time subscription needed for API-based approach
    }, [employeeId]);

    const uploadCSV = async (file: File) => {
        try {
            const { processCSVFile } = await import('../services/csvProcessor');
            const result = await processCSVFile(file);
            
            // Refresh leads after upload
            const { data } = await supabase.from('unikleadsapi').select('*');
            setLeads(data || []);
            
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Upload failed');
            throw err;
        }
    };

    return {
        leads,
        loading,
        error,
        uploadCSV
    };
};