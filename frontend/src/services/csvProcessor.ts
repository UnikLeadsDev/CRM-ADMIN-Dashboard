import { supabase } from '../config/supabase';
import type { Lead } from '../types';

export const processCSVFile = async (file: File): Promise<{
    success: boolean;
    processedCount: number;
    failedRows: Array<{ row: number; reason: string }>;
}> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = async (e) => {
            try {
                const csv = e.target?.result as string;
                const lines = csv.split('\n');
                const headers = lines[0].split(',').map(h => h.trim());
                
                const leads: Lead[] = [];
                const failedRows: Array<{ row: number; reason: string }> = [];
                
                for (let i = 1; i < lines.length; i++) {
                    if (!lines[i].trim()) continue;
                    
                    const values = lines[i].split(',').map(v => v.trim());
                    const row: any = {};
                    
                    headers.forEach((header, index) => {
                        row[header] = values[index] || '';
                    });
                    
                    if (!row['Customer Name'] || !row['Mobile Number']) {
                        failedRows.push({
                            row: i + 1,
                            reason: 'Missing required fields'
                        });
                        continue;
                    }
                    
                    leads.push({
                        'Assigned to Lead Employee ID': row['Assigned to Lead Employee ID'] || '',
                        'Customer Name': row['Customer Name'],
                        'Mobile Number': row['Mobile Number'],
                        'Product looking': row['Product looking'] || '',
                        'Type of Lead': row['Type of Lead'] || '',
                        'Customer City': row['Customer City'] || '',
                        'Email ID': row['Email ID'] || '',
                        'Date': new Date().toISOString(),
                        status: 'open' as const
                    });
                }
                
                if (leads.length > 0) {
                    const { error } = await supabase
                        .from('unikleadsapi')
                        .insert(leads);
                    
                    if (error) throw error;
                }
                
                resolve({
                    success: true,
                    processedCount: leads.length,
                    failedRows
                });
            } catch (error) {
                reject(error);
            }
        };
        
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};