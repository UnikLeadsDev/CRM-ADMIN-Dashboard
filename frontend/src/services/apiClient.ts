import { supabase } from '../config/supabase';
import type { Lead, LeadAssignment } from '../types';

export const apiClient = {
  // 1. ASSIGNED LEADS API
  async getAssignedLeads(): Promise<LeadAssignment[]> {
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

  async assignLeads(leads: Lead[], employeeId: string) {
    for (const lead of leads) {
      const { error } = await supabase
        .from('unikleadsapi')
        .update({ 
          'Assigned to Lead Employee ID': employeeId,
          status: 'open'
        })
        .eq('Customer Name', lead['Customer Name'])
        .eq('Mobile Number', lead['Mobile Number']);
      
      if (error) throw error;
    }
    return { success: true, assigned: leads.length };
  },

  async updateLeadStatus(lead: Lead, status: Lead['status']) {
    const { error } = await supabase
      .from('unikleadsapi')
      .update({ status })
      .eq('Customer Name', lead['Customer Name'])
      .eq('Mobile Number', lead['Mobile Number']);
    
    if (error) throw error;
    return { success: true };
  },

  async reassignLead(lead: Lead, newEmployeeId: string) {
    const { error } = await supabase
      .from('unikleadsapi')
      .update({ 
        'Assigned to Lead Employee ID': newEmployeeId || null
      })
      .eq('Customer Name', lead['Customer Name'])
      .eq('Mobile Number', lead['Mobile Number'])
      .eq('Email ID', lead['Email ID']);
    
    if (error) throw error;
    return { success: true };
  },

  // 2. GENERATE LEADS & ADDED LEADS API
  async generateLeads(leads: any[]) {
    const processedLeads = leads.map(lead => ({
      ...lead,
      'Date': new Date().toISOString(),
      status: 'open',
      source: 'generated'
    }));
    
    const { data, error } = await supabase
      .from('unikleadsapi')
      .insert(processedLeads)
      .select();
    
    if (error) throw error;
    return { success: true, generated: data.length, leads: data };
  },

  async addLeads(leads: any[]) {
    const processedLeads = leads.map(lead => ({
      ...lead,
      'Date': new Date().toISOString(),
      status: 'open',
      source: 'manual'
    }));
    
    const { data, error } = await supabase
      .from('unikleadsapi')
      .insert(processedLeads)
      .select();
    
    if (error) throw error;
    return { success: true, added: data.length, leads: data };
  },

  async getLeads(filters?: { source?: string; status?: string; employeeId?: string }) {
    let query = supabase.from('unikleadsapi').select('*');
    
    if (filters?.source) query = query.eq('source', filters.source);
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.employeeId) query = query.eq('Assigned to Lead Employee ID', filters.employeeId);
    
    const { data, error } = await query.order('Date', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // 3. CHANNEL PARTNER API
  async createChannelPartner(partner: any) {
    const { data, error } = await supabase
      .from('channel_partners')
      .insert([{
        ...partner,
        commission_rate: partner.commission_rate || 0,
        status: 'active',
        created_at: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    return { success: true, partner: data[0] };
  },

  async getChannelPartners(filters?: { status?: string; territory?: string }) {
    let query = supabase.from('channel_partners').select('*');
    
    if (filters?.status) query = query.eq('status', filters.status);
    if (filters?.territory) query = query.eq('territory', filters.territory);
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateChannelPartner(id: string, updates: any) {
    const { data, error } = await supabase
      .from('channel_partners')
      .update(updates)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return { success: true, partner: data[0] };
  },

  async deleteChannelPartner(id: string) {
    const { error } = await supabase
      .from('channel_partners')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  }
};