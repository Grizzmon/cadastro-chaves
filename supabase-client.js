import {createClient} from "https://esm.sh/@supabase/supabase-js@2.57.0";
import {SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY} from "./config.js";
export const configured = !SUPABASE_PUBLISHABLE_KEY.startsWith("COLOCAR_");
export const db = configured ? createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY) : null;
