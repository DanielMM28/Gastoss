import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kruppajdeijctyupavyw.supabase.co'
const supabaseKey = 'sb_publishable_j_aoak_yAq7jrNoW1TnkwA_es6a59tj'

export const supabase = createClient(supabaseUrl, supabaseKey)
