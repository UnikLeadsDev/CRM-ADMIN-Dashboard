// useLeads.ts
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
                let query = supabase.from('unikleadsapi').select('*').order('Date', { ascending: false });
                
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
    }, [employeeId]);

    // 🚀 Updated uploadCSV: send file to backend
    const uploadCSV = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('http://44.193.214.12:3001/api/assignedleads/upload-csv', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to upload CSV');
        }

        const result = await response.json();
        return result; // contains inserted count, failed rows etc.
    };

    return {
        leads,
        loading,
        error,
        uploadCSV
    };
};
