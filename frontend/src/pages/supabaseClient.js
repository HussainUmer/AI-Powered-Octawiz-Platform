import { createClient } from '@supabase/supabase-js';

// Paste your Supabase URL and Key below
const supabaseUrl = 'https://sumolzzumompsruijhfo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bW9senp1bW9tcHNydWlqaGZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDA3OTE3NSwiZXhwIjoyMDY1NjU1MTc1fQ.RiQW-zX8oiHS61n-Qx7N8GvyUcaN3CQIizta5zUW-1w';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase URL and Key must be provided in this file');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
