import { Card, CardContent, CardActions, Typography, Button, Chip, Stack } from '@mui/material';
import { Call as CallIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import type { Lead } from '../types';

interface LeadCardProps {
    lead: Lead;
}

export const LeadCard = ({ lead }: LeadCardProps) => {
    const handleCall = () => {
        window.location.href = `tel:${lead['Mobile Number']}`;
    };

    const handleWhatsApp = () => {
        const whatsappUrl = `https://wa.me/${lead['Mobile Number']}`;
        window.open(whatsappUrl, '_blank');
    };

    const getStatusColor = (status: string): "success" | "warning" | "error" => {
        switch (status) {
            case 'Hot Lead':
                return 'error';
            case 'Warm Lead':
                return 'warning';
            case 'Cold Lead':
                return 'success';
            default:
                return 'warning';
        }
    };

    return (
        <Card sx={{ width: '100%', maxWidth: 400, mb: 2 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Stack 
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center"
                    >
                        <Typography variant="h6">
                            {lead['Customer Name']}
                        </Typography>
                        <Chip 
                            label={lead['Type of Lead']}
                            color={getStatusColor(lead['Type of Lead'])}
                            size="small"
                        />
                    </Stack>

                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="caption">
                            Mobile Number
                        </Typography>
                        <Typography variant="body1">
                            {lead['Mobile Number']}
                        </Typography>
                    </Stack>

                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="caption">
                            Email
                        </Typography>
                        <Typography variant="body1">
                            {lead['Email ID']}
                        </Typography>
                    </Stack>

                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="caption">
                            Product
                        </Typography>
                        <Typography variant="body1">
                            {lead['Product looking']}
                        </Typography>
                    </Stack>

                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="caption">
                            City
                        </Typography>
                        <Typography variant="body1">
                            {lead['Customer City']}
                        </Typography>
                    </Stack>

                    <Stack spacing={1}>
                        <Typography color="text.secondary" variant="caption">
                            Upload Date
                        </Typography>
                        <Typography variant="body1">
                            {new Date(lead['Date']).toLocaleString()}
                        </Typography>
                    </Stack>
                </Stack>
            </CardContent>

            <CardActions sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                    <Button
                        variant="contained"
                        startIcon={<CallIcon />}
                        onClick={handleCall}
                        fullWidth
                    >
                        Call
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<WhatsAppIcon />}
                        color="success"
                        onClick={handleWhatsApp}
                        fullWidth
                    >
                        WhatsApp
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
};