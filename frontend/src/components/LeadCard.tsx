import { Card, CardContent, CardActions, Typography, Button, Chip, Stack } from '@mui/material';
import { Call as CallIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import type { Lead } from '../types';
import { apiClient } from '../services/apiClient';

interface LeadCardProps {
  lead: Lead;
  onStatusChange: (lead: Lead, status: Lead['status']) => void;
}

export const LeadCard = ({ lead, onStatusChange }: LeadCardProps) => {
  const handleCall = () => {
    window.location.href = `tel:${lead.phone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${lead.phone}`, '_blank');
  };

  const handleStatusUpdate = async (status: Lead['status']) => {
    try {
      await apiClient.updateLeadStatus(lead, status);
      onStatusChange(lead, status);
    } catch (err) {
      alert('Failed to update status');
      console.error(err);
    }
  };

  const getStatusColor = (status: Lead['status']) => {
    switch (status) {
      case 'open': return 'primary';
      case 'in_process': return 'warning';
      case 'closed': return 'success';
      case 'not_interested': return 'error';
      default: return 'default';
    }
  };

  return (
    <Card sx={{ height: 280, display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flex: 1 }}>
        <Stack spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{lead.name}</Typography>
            <Chip label={lead.status} color={getStatusColor(lead.status)} size="small" />
          </Stack>
          <Typography variant="body2">📱 {lead.phone}</Typography>
          <Typography variant="body2">✉️ {lead.email}</Typography>
          <Typography variant="body2">🏷️ {lead.product}</Typography>
          <Typography variant="body2">📍 {lead.city}</Typography>
          {lead.assigned_to && <Typography variant="body2">👤 {lead.assigned_to}</Typography>}
          <Typography variant="caption">📅 {new Date(lead.date).toLocaleDateString()}</Typography>
        </Stack>
      </CardContent>

      <CardActions sx={{ p: 1 }}>
        <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
          <Button variant="contained" size="small" fullWidth onClick={handleCall}>
            <CallIcon sx={{ fontSize: 16, mr: 0.5 }} />Call
          </Button>
          <Button variant="contained" color="success" size="small" fullWidth onClick={handleWhatsApp}>
            <WhatsAppIcon sx={{ fontSize: 16, mr: 0.5 }} />WhatsApp
          </Button>
        </Stack>
      </CardActions>

      {/* Status Update */}
      <Stack sx={{ p: 1 }}>
        <select
          value={lead.status}
          onChange={e => handleStatusUpdate(e.target.value as Lead['status'])}
          style={{ width: '100%', padding: '4px' }}
        >
          <option value="open">Open</option>
          <option value="in_process">In Process</option>
          <option value="closed">Closed</option>
          <option value="not_interested">Not Interested</option>
        </select>
      </Stack>
    </Card>
  );
};
