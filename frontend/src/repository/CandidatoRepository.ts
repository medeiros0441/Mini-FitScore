import { supabase } from "@/lib/supabase";
import { Candidato } from "@/lib/interface";

const TABLE_NAME = "candidatos";

export class CandidatoRepository {
  /** Insere um novo candidato */
  static async insert(candidato: Omit<Candidato, "id" | "created_at">): Promise<Candidato[]> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert([candidato])
      .select();
    if (error) throw new Error(error.message);
    return data ?? [];
  }

  /** Verifica se um e-mail já existe na tabela de candidatos */
  static async emailExist(email: string): Promise<boolean> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("id")
      .eq("email", email);
    if (error) throw new Error(error.message);
    return !!(data && data.length);
  }

  /** Retorna um candidato pelo e-mail */
  static async getByEmail(email: string): Promise<Candidato | null> {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("email", email)
      .single();
    if (error) {
      if (error.code === "PGRST116") return null; // Registro não encontrado
      throw new Error(error.message);
    }
    return data;
  }
 
}
