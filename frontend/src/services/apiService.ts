import type { Lead, LeadAssignment } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://44.193.214.12:3001/api';

export const apiService = {
  // Upload leads via API
  async uploadLeads(leads: Lead[]): Promise<{ success: boolean; count: number }> {
    const response = await fetch(`${API_BASE_URL}/leads/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leads })
    });
    return response.json();
  },

  // Get all leads
  async getLeads(): Promise<Lead[]> {
    const response = await fetch(`${API_BASE_URL}/leads`);
    return response.json();
  },

  // Get leads by employee
  async getLeadsByEmployee(employeeId: string): Promise<Lead[]> {
    const response = await fetch(`${API_BASE_URL}/leads/employee/${employeeId}`);
    return response.json();
  },

  // Assign leads to employee
  async assignLeads(leadIds: string[], employeeId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/leads/assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadIds, employeeId })
    });
  },

  // Auto-assign leads
  async autoAssignLeads(leadIds: string[], employeeIds: string[]): Promise<void> {
    await fetch(`${API_BASE_URL}/leads/auto-assign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadIds, employeeIds })
    });
  },

  // Update lead status
  async updateLeadStatus(leadId: string, status: Lead['status']): Promise<void> {
    await fetch(`${API_BASE_URL}/leads/${leadId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  // Get assignment report
  async getAssignmentReport(): Promise<LeadAssignment[]> {
    const response = await fetch(`${API_BASE_URL}/leads/assignments`);
    return response.json();
  },

  // Get unassigned leads
  async getUnassignedLeads(): Promise<Lead[]> {
    const response = await fetch(`${API_BASE_URL}/leads/unassigned`);
    return response.json();
  }
};