import { supabase } from "@/lib/supabase";
import { Avaliador } from "@/lib/interface";

export class AvaliadorRepository {
        
      static async getByEmail(email: string): Promise<Avaliador | null> {
        const { data, error } = await supabase
          .from("avaliadores")
          .select("*")
          .eq("email", email)
          .maybeSingle(); // retorna null se não encontrar

        if (error) {
          throw error; // qualquer outro erro real será lançado
        }

        return data; // pode ser null
      }


  static async insert(avaliador: Omit<Avaliador, "id">): Promise<Avaliador | null> {
    const { data, error } = await supabase
      .from("avaliadores")
      .insert(avaliador)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async updateMensagem(id: string, receber_mensagem: boolean): Promise<Avaliador | null> {
    const { data, error } = await supabase
      .from("avaliadores")
      .update({ receber_mensagem })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}
