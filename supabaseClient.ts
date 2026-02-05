
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ccszyfbqfwwfgqlzzsvi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjc3p5ZmJxZnd3ZmdxbHp6c3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyNjE2OTIsImV4cCI6MjA4NTgzNzY5Mn0._W8tbpkXfB2Cm9zErrVKw6be5DlejIg1d_k7OiBKYdE';

export const supabase = createClient(supabaseUrl, supabaseKey);
