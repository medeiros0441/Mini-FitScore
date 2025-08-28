import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Pega as variáveis de ambiente do Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!supabaseAnonKey || !supabaseUrl) {
  throw new Error("A variável de ambiente N8N_BASE_URL não está definida.");
}
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL ou Anon Key não definidos nas variáveis de ambiente.");
}

// Cria e exporta o cliente Supabase
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);