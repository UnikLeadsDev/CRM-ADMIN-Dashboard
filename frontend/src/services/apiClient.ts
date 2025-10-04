import type { Lead, LeadAssignment } from '../types';

const BASE_URL = 'http://44.193.214.12:3001/api'; // change to your backend URL

export const apiClient = {
  // 1. Get all assigned leads
  async getAssignedLeads(): Promise<LeadAssignment[]> {
    const res = await fetch(`${BASE_URL}/getassignleads`);
    if (!res.ok) throw new Error('Failed to fetch assigned leads');
    const data = await res.json();

    // Convert backend data to LeadAssignment format
    const assignments: { [key: string]: LeadAssignment } = {};
    data.leads.forEach((lead: Lead) => {
      const empId = lead.assigned_to; // adapt field name from your DB
      if (empId) {
        if (!assignments[empId]) {
          assignments[empId] = {
            employee_id: empId,
            lead_count: 0,
            leads: []
          };
        }
        assignments[empId].lead_count++;
        assignments[empId].leads.push(lead);
      }
    });

    return Object.values(assignments);
  },

  // 2. Assign leads to employee
  async assignLeads(leads: Lead[], employeeId: string) {
    const res = await fetch(`${BASE_URL}/assignleads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads, employeeId })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed to assign leads');
    return data;
  },

  // 3. Update lead status
  async updateLeadStatus(lead: Lead, status: Lead['status']) {
    const res = await fetch(`${BASE_URL}/updateleadstatus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead, status })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed to update lead status');
    return data;
  },

  // 4. Reassign lead
  async reassignLead(lead: Lead, newEmployeeId: string) {
    const res = await fetch(`${BASE_URL}/reassignlead`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead, newEmployeeId })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Failed to reassign lead');
    return data;
  },

  // 5. Get leads with optional filters
  async getLeads(filters?: { status?: string; employeeId?: string }) {
    const query = new URLSearchParams(filters as any).toString();
    const res = await fetch(`${BASE_URL}/getassignleads?${query}`);
    if (!res.ok) throw new Error('Failed to fetch leads');
    const data = await res.json();
    return data.leads;
  }
};
