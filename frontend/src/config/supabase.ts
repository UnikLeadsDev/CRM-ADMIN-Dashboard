import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.REACT_APP_SUPABASE_URL || 'https://vjiruxajzsszxujralau.supabase.co';
const supabaseKey = import.meta.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqaXJ1eGFqenNzenh1anJhbGF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2NjM5MTcsImV4cCI6MjA3MzIzOTkxN30._NpYSbm2UBnrVBkJPp6Nh-IUvdgrX5WhkoAwL5GytgQ';

export const supabase = createClient(supabaseUrl, supabaseKey);