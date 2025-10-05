import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Stack,
  Typography,
  LinearProgress,
  Alert,
  Snackbar,
  useMediaQuery,
  useTheme,
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

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'An error occurred', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
  sx={{
    p: { xs: 2, sm: 3 },
    border: 1,
    borderRadius: 2,
    borderColor: 'divider',
    bgcolor: 'background.paper',
    width: { xs: '100%', sm: '40%' }, // narrower but not centered
    mx: 0, 
    my: { xs: 2, sm: 0 }, // vertical margin for spacing on small screens
    ml: { sm: 0 }, // ✅ stay aligned to left
    boxShadow: { xs: 0, sm: 2 },
  }}
>
      <Stack spacing={2}>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            color: 'text.primary',
            textAlign: isMobile ? 'center' : 'left',
          }}
        >
          Upload CSV
        </Typography>

        <Stack
          direction={isMobile ? 'column' : 'row'}
          spacing={isMobile ? 2 : 1}
          alignItems={isMobile ? 'stretch' : 'center'}
        >
          <TextField
            type="file"
            inputProps={{ accept: '.csv' }}
            onChange={handleFileChange}
            disabled={uploading}
            size="small"
            sx={{ flex: 1 }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || uploading}
            size="medium"
            sx={{
              whiteSpace: 'nowrap',
              minWidth: { xs: '100%', sm: 120 },
              alignSelf: isMobile ? 'stretch' : 'center',
            }}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Stack>

        {uploading && <LinearProgress />}
      </Stack>

      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
