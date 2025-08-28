import { FitScorePerguntasRepository } from "@/repository/FitScorePerguntasRepository";
import { toast } from "sonner";
import { PerguntasPorBloco } from "@/lib/interface";

export class FitScorePerguntasService {
  /** Retorna todas as perguntas agrupadas por bloco */
  static async listar(): Promise<PerguntasPorBloco> {
    try {
      const perguntas = await  FitScorePerguntasRepository.listar();
      return perguntas;
    } catch (err) {
      console.error("Erro ao buscar perguntas:", err);
      toast.error("Erro ao carregar perguntas.");
      return {};
    }
  }
}
