import type { Lead, LeadAssignment } from '../types';

export const leadAssignmentService = {
  // Update lead status (calls your backend API)
  async updateLeadStatus(lead: Lead, status: Lead['status']): Promise<void> {
    const res = await fetch(`http://localhost:3001/api/leads/${lead.id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update lead status');
    }
  },

  // Get all leads grouped by assigned_to
  // Get all leads grouped by assigned_to
async getLeadAssignments(): Promise<LeadAssignment[]> {
  const res = await fetch('http://localhost:3001/api/getassignleads', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to fetch leads');
  }

  const data = await res.json();

  if (!data.success || !data.leads) return [];

  // Group by assigned_to (employee id)
  const grouped: Record<string, Lead[]> = {};
  data.leads.forEach((lead: Lead) => {
    const empId = lead.assigned_to || 'UNASSIGNED';
    if (!grouped[empId]) grouped[empId] = [];
    grouped[empId].push(lead);
  });

  // Convert into LeadAssignment[]
  return Object.entries(grouped).map(([employee_id, leads]) => ({
    employee_id,
    lead_count: leads.length,
    leads,
  }));
}

};
