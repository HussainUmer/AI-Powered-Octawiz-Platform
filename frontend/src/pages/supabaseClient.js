// src/supabaseClient.js

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sumolzzumompsruijhfo.supabase.co'; // Replace with your project URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1bW9senp1bW9tcHNydWlqaGZvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDA3OTE3NSwiZXhwIjoyMDY1NjU1MTc1fQ.RiQW-zX8oiHS61n-Qx7N8GvyUcaN3CQIizta5zUW-1w'; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseKey);
