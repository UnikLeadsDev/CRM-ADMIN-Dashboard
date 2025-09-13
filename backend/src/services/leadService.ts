import { parse } from 'csv-parse';
import { Readable } from 'stream';
import { CSVRow, Lead } from '../types';
import { supabase } from '../config/supabase';

export class LeadService {
    private static transformCSVToLead(row: CSVRow): Lead {
        return {
            'Assigned to Lead Employee ID': row['Assigned to Lead Employee ID'],
            'Customer Name': row['Customer Name'],
            'Mobile Number': row['Mobile Number'],
            'Product looking': row['Product looking'],
            'Type of Lead': row['Type of Lead'],
            'Customer City': row['Customer City'],
            'Email ID': row['Email ID'],
            'Date': new Date().toISOString()
        };
    }

    public static async processCSVFile(fileBuffer: Buffer): Promise<{
        success: boolean;
        processedCount: number;
        failedRows: Array<{ row: number; reason: string }>;
    }> {
        return new Promise((resolve, reject) => {
            const records: CSVRow[] = [];
            const failedRows: Array<{ row: number; reason: string }> = [];

            const parser = parse({
                columns: true,
                skip_empty_lines: true
            });

            parser.on('readable', function() {
                let record: CSVRow;
                while ((record = parser.read()) !== null) {
                    records.push(record);
                }
            });

            parser.on('error', function(err) {
                console.error('CSV parse error:', err);
                reject(err);
            });

            parser.on('end', async function() {
                try {
                    console.log('Parsed records:', records.length);
                    const leads: Lead[] = [];

                    for (let i = 0; i < records.length; i++) {
                        const record = records[i];
                        const rowNumber = i + 2;
                        
                        if (!record['Customer Name'] || !record['Mobile Number']) {
                            failedRows.push({
                                row: rowNumber,
                                reason: 'Missing required fields'
                            });
                            continue;
                        }

                        leads.push(LeadService.transformCSVToLead(record));
                    }

                    console.log('Valid leads to insert:', leads.length);

                    if (leads.length > 0) {
                        const { error } = await supabase.from('unikleadsapi').insert(leads);
                        if (error) {
                            console.error('Database insert error:', error);
                            throw error;
                        }
                    }

                    resolve({
                        success: true,
                        processedCount: leads.length,
                        failedRows
                    });
                } catch (error) {
                    console.error('Processing error:', error);
                    reject(error);
                }
            });

            Readable.from(fileBuffer).pipe(parser);
        });
    }
}