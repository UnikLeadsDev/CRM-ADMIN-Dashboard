import { Container, Stack, Typography, Skeleton, Box } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEmployee } from '../hooks/useEmployee';
import { useLeads } from '../hooks/useLeads';
import { LeadCard } from './LeadCard';

export const EmployeeDashboard = () => {
    const { employeeId } = useParams<{ employeeId: string }>();
    const { employee, loading: employeeLoading, error: employeeError } = useEmployee(employeeId);
    const { leads, loading: leadsLoading, error: leadsError } = useLeads(employeeId);

    if (employeeError || leadsError) {
        return (
            <Container sx={{ py: 4 }}>
                <Typography color="error">
                    {employeeError || leadsError}
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ py: 4 }}>
            <Stack spacing={4}>
                {employeeLoading ? (
                    <Skeleton variant="text" width={300} height={60} />
                ) : (
                    <Typography variant="h3">
                        {employee ? `Welcome, ${employee.name}` : 'Loading...'}
                    </Typography>
                )}

                <Box>
                    <Typography variant="h4" gutterBottom>
                        Your Leads
                    </Typography>

                    {leadsLoading ? (
                        <Stack spacing={2}>
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} variant="rectangular" height={200} />
                            ))}
                        </Stack>
                    ) : leads.length === 0 ? (
                        <Typography>No leads assigned yet.</Typography>
                    ) : (
                        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
                            {leads.map((lead, index) => (
                                <LeadCard key={index} lead={lead} />
                            ))}
                        </Box>
                    )}
                </Box>
            </Stack>
        </Container>
    );
};