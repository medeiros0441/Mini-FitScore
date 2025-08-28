import { FitScoreResposta } from "@/lib/interface";
import { toast } from "sonner"; // ou "react-toastify"
import { FitScoreRespostaRepository } from "@/repository/FitScoreRespostaRepository";
import {enviarFitScoreRespostas} from "@/lib/request";

export class FitScoreRespostaService {
  
   static async criarFitScoreResposta(respostas: FitScoreResposta[]): Promise<boolean> {
    if (respostas.length === 0) {
      toast.error("Nenhuma resposta fornecida.");
      return false;
    }

    try {
      // Monta o payload no formato esperado
    const payload = respostas.map(r => ({
  candidato_id: r.candidato_id,
  pergunta_id: r.pergunta_id,
  opcao_id: r.opcao_id,
}));

      // Chama repository para executar a procedure
      const resultado = await enviarFitScoreRespostas(payload);

      if (!resultado) {
        toast.error("Não foi possível salvar as respostas do Fit Score.");
        return false;
      }

      toast.success("Respostas do Fit Score salvas com sucesso!");
      return true;

    } catch (error) {
      console.error("Erro ao salvar respostas do Fit Score:", error);
      toast.error("Erro inesperado ao salvar respostas do Fit Score.");
      return false;
    }
  }

  static async buscarRespostas(candidato_id: string): Promise<FitScoreResposta[] | null> {
    try {
      return await FitScoreRespostaRepository.buscarRespostasPorCandidato(candidato_id);
    } catch (error) {
      console.error("Erro ao buscar respostas do Fit Score:", error);
      toast.error("Erro ao buscar respostas do Fit Score.");
      return null;
    }
  }
}
