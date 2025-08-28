import { FitScoreClassificacaoRepository } from "@/repository/FitScoreClassificacaoRepository";
import { FitScoreClassificacao, ListaClassificacao } from "@/lib/interface";
import { toast } from "sonner";

export class FitScoreClassificacaoService {

  // 📊 Listar todas as classificações
  static async listarClassificacoes(): Promise<ListaClassificacao[]> {
    try {
      const lista = await FitScoreClassificacaoRepository.getListaClassificacao();

      if (lista.length === 0) {
        toast.info("Nenhuma classificação encontrada.");
      }

      return lista;
    } catch (error) {
      console.error("Erro ao listar classificações:", error);
      toast.error("Falha ao carregar classificações.");
      return [];
    }
  }

static async getPorCandidato(candidatoId: string): Promise<FitScoreClassificacao | false> {
    try {
      const classificacao = await FitScoreClassificacaoRepository.getByCandidato(candidatoId);
      return classificacao ?? false;
    } catch (error) {
      console.error("Erro ao buscar classificação:", error);
      toast.error("Falha ao buscar classificação do Fit Score.");
      return false;
    }
  }
 
}
