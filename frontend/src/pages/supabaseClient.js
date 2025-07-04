import { createClient } from '@supabase/supabase-js';

// Debug: Log environment variables
console.log('REACT_APP_SUPABASE_URL:', process.env.REACT_APP_SUPABASE_URL);
console.log('REACT_APP_SUPABASE_KEY:', process.env.REACT_APP_SUPABASE_KEY);

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided in .env file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
