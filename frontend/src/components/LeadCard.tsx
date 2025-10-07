import { Card, CardContent, CardActions, Typography, Button, Chip, Stack, Link} from '@mui/material';
import { Call as CallIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import type { Lead } from '../types';
import axios from 'axios';


interface LeadCardProps {
  lead: Lead;
  onStatusChange: (lead: Lead, status: Lead['status']) => void;
}

export const LeadCard = ({ lead }: LeadCardProps) => {
  const handleCall = () => {
    window.location.href = `tel:${lead.phone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${lead.phone}`, '_blank');
  };

   const handleStatusUpdate = async (lead: Lead, status: Lead['status']) => {
    try {
     
      await axios.put(`http://44.193.214.12:3001/api/leads/${lead.id}/status`, { status });
      
    } catch (error) {
      console.error('Error updating status:', error);
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
    <Card sx={{ height: 350, display: 'flex', flexDirection: 'column' }}>
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
         <Typography variant="body2">
            📌{" "}
            <Link 
              href={lead.location} 
              target="_blank" 
              rel="noopener noreferrer" 
              underline="hover" 
              sx={{ color: '#1976d2', cursor: 'pointer' }}
            >
              Live Location
            </Link>
          </Typography>

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
    {/* Status Update */}
          <Stack sx={{ p: 1 }}>
            <select
              value={lead.status}
              onChange={e => handleStatusUpdate(lead, e.target.value as Lead['status'])}
              style={{ width: '100%', padding: '4px' }}
            >
              <option value="new_added">New Added</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="in_follow_up">In Follow-Up</option>
              <option value="converted">Converted</option>
              <option value="not_interested">Not Interested</option>
              <option value="invalid">Invalid</option>
            </select>
          </Stack>

    </Card>
  );
};
