import 'dotenv/config' // ES modules
// or
require('dotenv').config() // CommonJS

// Now you can use:
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY