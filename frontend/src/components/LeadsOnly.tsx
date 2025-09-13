import { Box, Grid, Typography, CircularProgress } from '@mui/material';
import { LeadCard } from './LeadCard';
import { useLeads } from '../hooks/useLeads';

export const LeadsOnly = () => {
    const { leads, loading, error } = useLeads();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box p={4}>
                <Typography color="error">Error loading leads: {error}</Typography>
            </Box>
        );
    }

    if (leads.length === 0) {
        return (
            <Box p={4}>
                <Typography>No leads available.</Typography>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Grid container spacing={3}>
                {leads.map((lead, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <LeadCard lead={lead} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};