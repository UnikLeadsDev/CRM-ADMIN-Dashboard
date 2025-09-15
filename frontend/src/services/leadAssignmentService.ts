import { supabase } from '../config/supabase';
import type { Lead, LeadAssignment } from '../types';

export const leadAssignmentService = {
  // Assign leads to employee by lead data
  async assignLeadsByData(leads: Lead[], employeeId: string): Promise<void> {
    for (const lead of leads) {
      const { error } = await supabase
        .from('unikleadsapi')
        .update({ 
          'Assigned to Lead Employee ID': employeeId,
          assigned_at: new Date().toISOString(),
          status: 'open'
        })
        .eq('Customer Name', lead['Customer Name'])
        .eq('Mobile Number', lead['Mobile Number']);
      
      if (error) throw error;
    }
  },

  // Auto-assign leads using round-robin by lead data
  async autoAssignLeadsByData(leads: Lead[], employeeIds: string[]): Promise<void> {
    for (let i = 0; i < leads.length; i++) {
      const employeeId = employeeIds[i % employeeIds.length];
      const lead = leads[i];
      const { error } = await supabase
        .from('unikleadsapi')
        .update({
          'Assigned to Lead Employee ID': employeeId,
          assigned_at: new Date().toISOString(),
          status: 'open'
        })
        .eq('Customer Name', lead['Customer Name'])
        .eq('Mobile Number', lead['Mobile Number']);
      
      if (error) throw error;
    }
  },

  // Update lead status by lead data
  async updateLeadStatus(lead: Lead, status: Lead['status']): Promise<void> {
    const { error } = await supabase
      .from('unikleadsapi')
      .update({ status })
      .eq('Customer Name', lead['Customer Name'])
      .eq('Mobile Number', lead['Mobile Number']);
    
    if (error) throw error;
  },

  // Get leads assigned to employees
  async getLeadAssignments(): Promise<LeadAssignment[]> {
    const { data, error } = await supabase
      .from('unikleadsapi')
      .select('*')
      .not('Assigned to Lead Employee ID', 'is', null)
      .neq('Assigned to Lead Employee ID', '');
    
    if (error) throw error;

    const assignments: { [key: string]: LeadAssignment } = {};
    
    data?.forEach(lead => {
      const empId = lead['Assigned to Lead Employee ID'];
      if (empId && empId.trim()) {
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

  // Get unassigned leads
  async getUnassignedLeads(): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('unikleadsapi')
      .select('*')
      .or('Assigned to Lead Employee ID.is.null,Assigned to Lead Employee ID.eq.');
    
    if (error) throw error;
    return data || [];
  }
};