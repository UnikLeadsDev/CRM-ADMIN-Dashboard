import { Container, Stack, Typography, CircularProgress, Box } from '@mui/material';
import { CSVUpload } from './CSVUpload';
import { LeadCard } from './LeadCard';
import { useLeads } from '../hooks/useLeads';

export const AdminDashboard = () => {
  const { leads, loading, error } = useLeads();
  
  console.log('AdminDashboard - leads:', leads, 'loading:', loading, 'error:', error);

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      <Stack spacing={4}>
        <Typography variant="h3" align="center" gutterBottom>
          UniKLeads CRM - Admin Dashboard
        </Typography>

        <CSVUpload />

        {loading ? (
          <Stack alignItems="center" py={4}>
            <CircularProgress />
            <Typography>Loading leads...</Typography>
          </Stack>
        ) : error ? (
          <Stack alignItems="center" py={4}>
            <Typography color="error">Error: {error}</Typography>
          </Stack>
        ) : leads.length === 0 ? (
          <Stack alignItems="center" py={4}>
            <Typography>No leads found. Upload a CSV file to get started.</Typography>
          </Stack>
        ) : (
          <Box sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            }
          }}>
            {leads.map((lead, index) => (
              <LeadCard key={index} lead={lead} />
            ))}
          </Box>
        )}
      </Stack>
    </Container>
  );
};