import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
import { API_BASE_URL } from '../config/api';
import type { Lead } from '../types';

export const useLeads = (employeeId?: string) => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLeads = async () => {
            try {
                setLoading(true);
                console.log('Fetching leads from API...');
                
                const endpoint = employeeId 
                    ? `${API_BASE_URL}/leads/employee/${employeeId}`
                    : `${API_BASE_URL}/leads`;
                
                const response = await fetch(endpoint);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch leads');
                }
                
                const data = await response.json();
                console.log('API response:', data);

                setLeads(data || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching leads:', err);
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
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${API_BASE_URL}/leads/upload`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const result = await response.json();
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