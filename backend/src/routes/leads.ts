import express from 'express';
import multer from 'multer';
import { LeadService } from '../services/leadService';
import { supabase } from '../config/supabase';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        console.log('Upload request received');
        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('Processing file:', req.file.originalname);
        const result = await LeadService.processCSVFile(req.file.buffer);
        console.log('Processing result:', result);
        res.json(result);
    } catch (error) {
        console.error('Error processing CSV:', error);
        res.status(500).json({ error: error instanceof Error ? error.message : 'Error processing CSV file' });
    }
});

router.get('/', async (req, res) => {
    try {
        const { data: leads, error } = await supabase
            .from('unikleadsapi')
            .select('*');

        if (error) throw error;

        res.json(leads || []);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Error fetching leads' });
    }
});

router.get('/employee/:employeeId', async (req, res) => {
    try {
        const { data: leads, error } = await supabase
            .from('unikleadsapi')
            .select('*')
            .eq('Assigned to Lead Employee ID', req.params.employeeId);

        if (error) throw error;

        res.json(leads || []);
    } catch (error) {
        console.error('Error fetching leads:', error);
        res.status(500).json({ error: 'Error fetching leads' });
    }
});

export default router;