// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://obllonwzdjnokqeyvtsi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ibGxvbnd6ZGpub2txZXl2dHNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODQzMjIsImV4cCI6MjA3MjU2MDMyMn0.4hxTc9zEL-GBG2k1pDBUjtQIQHWgYRgoPfOSQ6uOAJc'  

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
