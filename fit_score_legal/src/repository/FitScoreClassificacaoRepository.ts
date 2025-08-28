import { supabase } from "@/lib/supabase";
import { FitScoreClassificacao,ListaClassificacao } from "@/lib/interface";

const TABLE_NAME = "fitscore_classificacao";

export class FitScoreClassificacaoRepository {

  // Inserir nova classificação
  static async insert(classificacao: Omit<FitScoreClassificacao, "id" | "created_at">): Promise<boolean> {
    const { error } = await supabase
      .from(TABLE_NAME)
      .insert([classificacao]);

    if (error) {
      console.error("Erro ao inserir classificação:", error.message);
      return false;
    }
    return true;
  }

// Buscar classificação por candidato
static async getByCandidato(candidatoId: string): Promise<FitScoreClassificacao | false> {
  try {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select("*")
      .eq("candidato_id", candidatoId)
      .limit(1)   // Pega apenas 1 registro
      .single();  // Retorna um objeto direto

    if (error) {
      console.error("Erro ao buscar classificações:", error.message);
      return false;
    }

    return data ?? false;
  } catch (err) {
    console.error("Erro inesperado ao buscar classificação:", err);
    return false;
  }
}

  // Buscar respostas do candidato
  static async getRespostasPorCandidato(candidatoId: string) {
    const { data, error } = await supabase
      .from("fitscore_respostas")
      .select("opcao_id")
      .eq("candidato_id", candidatoId);

    if (error) {
      console.error("Erro ao buscar respostas:", error.message);
      return [];
    }
    return data ?? [];
  }

  // Buscar opções por lista de IDs
  static async getOpcoesPorIds(opcaoIds: string[]) {
    const { data, error } = await supabase
      .from("fitscore_opcoes")
      .select("id, ponto")
      .in("id", opcaoIds);

    if (error) {
      console.error("Erro ao buscar opções:", error.message);
      return [];
    }
    return data ?? [];
  }

static async getListaClassificacao(): Promise<ListaClassificacao[]> {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(`
      fit_score,
      classificacao,
      candidato:candidatos (
        nome,
        email
      )
    `);

  if (error) {
    console.error("Erro ao buscar lista de classificações:", error.message);
    return [];
  }

  if (!data) return [];

  return data.map((item) => {
    const candidato = Array.isArray(item.candidato)
      ? item.candidato[0]
      : item.candidato;

    return {
      nome: candidato?.nome ?? "",
      email: candidato?.email ?? "",
      fitscore: item.fit_score as number,   // <- corrigido
      classificacao: item.classificacao as string,
    };
  });
}
}
