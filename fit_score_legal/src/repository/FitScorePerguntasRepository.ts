import { supabase } from "@/lib/supabase";
import { PerguntasPorBloco, PerguntaOpcao } from "@/lib/interface";
import { toast } from "sonner"; // ou "react-toastify"

export class FitScorePerguntasRepository {
  /** Lista todas as perguntas e suas opções, agrupadas por bloco */
  static async listar(): Promise<PerguntasPorBloco> {
    const result: PerguntasPorBloco = {};

    try {
      // Busca perguntas
      const { data: perguntasData, error: perguntaError } = await supabase
        .from("fitscore_perguntas")
        .select("*");

      if (perguntaError) {
        console.error("Erro ao buscar perguntas:", perguntaError);
        toast.error("Erro ao carregar perguntas.");
        return result;
      }

      // Busca opções
      const { data: opcoesData, error: opcoesError } = await supabase
        .from("fitscore_opcoes")
        .select("*");

      if (opcoesError) {
        console.error("Erro ao buscar opções:", opcoesError);
        toast.error("Erro ao carregar opções das perguntas.");
        return result;
      }

      // Monta resultado
      perguntasData?.forEach((pergunta) => {
        const bloco = pergunta.bloco;
        if (!result[bloco]) result[bloco] = {};

        const opcoes: PerguntaOpcao[] =
          opcoesData?.filter((op) => op.pergunta_id === pergunta.id)
            .map((op) => ({ id: op.id, texto: op.texto })) ?? [];

        result[bloco][pergunta.id] = {
          id: pergunta.id,
          pergunta: pergunta.texto,
          opcoes,
        };
      });

      return result;
    } catch (err) {
      console.error("Erro ao listar perguntas:", err);
      toast.error("Erro inesperado ao carregar perguntas.");
      return result;
    }
  }
}
