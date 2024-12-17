import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dhzvlqoifqpiodxnfqpa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenZscW9pZnFwaW9keG5mcXBhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyODk0NTIsImV4cCI6MjA0Njg2NTQ1Mn0.Zs28Qu3cy2ysvMDKXVm2kNiGN6gyfj3irr9sDvGfjuk';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Flower {
  id: number;
  name: string;
  imageUrl: string;
  bloomSeason: string;
  created_at: string;
  created_by: string;
}