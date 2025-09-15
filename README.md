# UniKLeads API - Lead Assignment System

## Features Implemented

### 1. Lead Assignment System
- **Manual Assignment**: Admin can assign leads to specific employees using Employee ID
- **Auto Assignment**: Round-robin algorithm distributes leads evenly among all employees
- **Lead Status Tracking**: Track lead status (open, in_process, closed, not_interested)

### 2. Admin Dashboard Pages
- **All Leads**: View all leads with CSV upload functionality
- **Assign Leads**: Assign unassigned leads to employees manually or automatically
- **Assignment Report**: Track which Employee ID got which leads and their status

### 3. Lead Management Features
- **Card-based View**: Leads displayed as cards showing name, phone, email, product, city, status
- **Employee Tracking**: See which leads are assigned to which employees
- **Status Updates**: Update lead status directly from the report view
- **Assignment Analytics**: View lead count per employee

### 4. Database Structure (Supabase)
- Uses existing `unikleadsapi` table
- Added fields: `status`, `assigned_at`
- Employee assignment via `Assigned to Lead Employee ID` field

### 5. Components Added
- `LeadAssignment.tsx`: Manual and auto-assignment interface
- `LeadsAssignedReport.tsx`: Employee-wise lead tracking and status management
- `leadAssignmentService.ts`: Service for all assignment operations
- Updated `AdminDashboard.tsx`: Tabbed navigation between features
- Updated `LeadCard.tsx`: Shows assignment and status information

## Usage

1. **Upload Leads**: Use CSV upload in "All Leads" tab
2. **Assign Leads**: Go to "Assign Leads" tab to distribute leads to employees
3. **Track Progress**: Use "Assignment Report" tab to monitor lead status and employee performance

## Technology Stack
- Frontend: React + TypeScript + Material-UI
- Backend: Supabase (no separate Express server needed)
- Database: PostgreSQL (via Supabase)
