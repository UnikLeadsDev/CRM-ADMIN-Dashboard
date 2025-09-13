import { useState } from 'react';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    TextField,
    Stack,
    Typography,
    LinearProgress,
    Alert,
    Snackbar
} from '@mui/material';
import { useLeads } from '../hooks/useLeads';

export const CSVUpload = () => {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState<{
        open: boolean;
        message: string;
        severity: 'success' | 'error' | 'warning';
    }>({ open: false, message: '', severity: 'success' });
    const { uploadCSV } = useLeads();

    const showToast = (message: string, severity: 'success' | 'error' | 'warning') => {
        setToast({ open: true, message, severity });
    };

    const handleCloseToast = () => {
        setToast({ ...toast, open: false });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'text/csv') {
                showToast('Please upload a CSV file', 'error');
                return;
            }
            setFile(selectedFile);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            showToast('Please select a CSV file to upload', 'warning');
            return;
        }

        try {
            setUploading(true);
            const result = await uploadCSV(file);
            
            showToast(
                `Processed ${result.processedCount} leads. ${result.failedRows.length} rows failed.`,
                'success'
            );

            if (result.failedRows.length > 0) {
                console.log('Failed rows:', result.failedRows);
                showToast(
                    `Upload completed with ${result.failedRows.length} failed rows. Check console for details.`,
                    'warning'
                );
            }

            setFile(null);
            // Reset the file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error) {
            showToast(
                error instanceof Error ? error.message : 'An error occurred',
                'error'
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ 
            p: 4, 
            border: 1, 
            borderRadius: 1, 
            borderColor: 'divider',
            bgcolor: 'background.paper' 
        }}>
            <Stack spacing={3}>
                <Typography variant="h6">
                    Upload Leads CSV
                </Typography>
                
                <FormControl>
                    <FormLabel>Select CSV File</FormLabel>
                    <TextField
                        type="file"
                        inputProps={{
                            accept: '.csv'
                        }}
                        onChange={handleFileChange}
                        disabled={uploading}
                        fullWidth
                    />
                </FormControl>

                {file && (
                    <Typography variant="body2" color="text.secondary">
                        Selected file: {file.name}
                    </Typography>
                )}

                {uploading && <LinearProgress />}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleUpload}
                    disabled={!file || uploading}
                    sx={{ mt: 2 }}
                >
                    {uploading ? 'Uploading...' : 'Upload CSV'}
                </Button>
            </Stack>

            <Snackbar
                open={toast.open}
                autoHideDuration={5000}
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseToast}
                    severity={toast.severity}
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};