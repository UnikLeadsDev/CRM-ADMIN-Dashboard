# UniKLeads Frontend

A React application for managing leads with CSV upload functionality.

## Features
- Upload CSV files to add leads
- View leads in card format
- Direct integration with Supabase
- No backend server required

## Environment Variables
Create a `.env.local` file:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Routes
- `/admin` - Admin dashboard with CSV upload
- `/leads` - View all leads (cards only)
- `/employee/:id` - Employee-specific leads

## Deployment
Deploy to Netlify:
1. Build command: `npm run build`
2. Publish directory: `dist`
3. Set environment variables in Netlify dashboard

## CSV Format
Required columns:
- Assigned to Lead Employee ID
- Customer Name
- Mobile Number
- Product looking
- Type of Lead
- Customer City
- Email ID