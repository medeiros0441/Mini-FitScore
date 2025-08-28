import { supabase } from "@/lib/supabase";
import { FitScoreResposta } from "@/lib/interface";

export class FitScoreRespostaRepository {
  /**
   * Verifica se o candidato já respondeu o quiz
   */
  static async candidatoJaExecutou(candidato_id: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from("fitscore_respostas")
        .select("*")
        .eq("candidato_id", candidato_id)
        .limit(1);

      if (error) {
        console.error("Erro ao verificar respostas do candidato:", error.message);
        return false;
      }

      return data && data.length > 0;
    } catch (err) {
      console.error("Erro inesperado ao verificar quiz:", err);
      return false;
    }
  }
  // Executa a procedure no banco
  static async inserirRespostas(respostasJson: string): Promise<boolean> {
    const { data, error } = await supabase
      .rpc("inserir_respostas_e_classificacao", { respostas_json: respostasJson });

    if (error) {
      console.error("Erro no repository:", error);
      return false;
    }

    return !!data;
  }
  /**
   * Busca todas as respostas de um candidato
   */
  static async buscarRespostasPorCandidato(candidato_id: string): Promise<FitScoreResposta[] | null> {
    try {
      const { data, error } = await supabase
        .from("fitscore_respostas")
        .select("*")
        .eq("candidato_id", candidato_id);

      if (error) {
        console.error("Erro ao buscar respostas:", error.message);
        return null;
      }

      return data || [];
    } catch (err) {
      console.error("Erro inesperado ao buscar respostas:", err);
      return null;
    }
  }
}
