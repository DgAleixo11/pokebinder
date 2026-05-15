import { supabase } from "@/lib/supabase/client";

export async function testSupabaseConnection() {
  const { data, error } = await supabase
    .from("pokemon_forms")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Erro ao conectar com Supabase:", error.message);
    return false;
  }

  console.log("Conexão com Supabase OK:", data);
  return true;
}