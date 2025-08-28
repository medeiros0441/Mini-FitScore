import { AvaliadorRepository } from "@/repository/AvaliadorRepository";
import { Avaliador, Usuario } from "@/lib/interface";
import { toast } from "sonner";
import { setUsuario } from "@/lib/localStorage"; // salva no localStorage

export class AvaliadorService {
  /** Cria um novo avaliador (se já existir, retorna o existente) */
    static async criar(avaliador: Omit<Avaliador, "id">): Promise<Usuario | null> {
    try {
      if (!avaliador.nome || !avaliador.email) {
        toast.warning("Preencha nome e e-mail.");
        return null;
      }

      // Garante created_at
      const avaliadorToInsert: Omit<Avaliador, "id"> = {
        ...avaliador,
        created_at: new Date().toISOString(),
      };

      // Verifica se já existe
      const existente = await AvaliadorRepository.getByEmail(avaliador.email);
      if (existente) {
        toast.success("Avaliador já existente!");
        const usuarioExistente: Usuario = {
          id: existente.id ?? "",
          nome: existente.nome ?? "",
          email: existente.email ?? "",
          tipo: "avaliador",
          receber_mensagem: existente.receber_mensagem ?? false,
          conclusao: false,
          created_at: existente.created_at ?? new Date().toISOString(),
        };
        setUsuario(usuarioExistente);
        return usuarioExistente;
      }

      // Cria novo avaliador
      const resultado = await AvaliadorRepository.insert(avaliadorToInsert);

      if (!resultado?.id) {
        toast.error("Erro ao criar avaliador.");
        return null;
      }

      const novoUsuario: Usuario = {
        id: resultado.id ?? "",
        nome: resultado.nome ?? "",
        email: resultado.email ?? "",
        tipo: "avaliador",
        receber_mensagem: resultado.receber_mensagem ?? false,
        conclusao: false,
        created_at: resultado.created_at ?? new Date().toISOString(),
      };

      setUsuario(novoUsuario);

      return novoUsuario;
    } catch (error) {
      console.error("Erro ao criar avaliador:", error);
      toast.error("Erro ao criar avaliador.");
      return null;
    }
  }

  /** Busca um avaliador pelo e-mail */
  static async getByEmail(email: string): Promise<Avaliador | null> {
    try {
      const resultado = await AvaliadorRepository.getByEmail(email);
      if (!resultado) {
        toast.warning("Avaliador não encontrado.");
        return null;
      }
      return resultado;
    } catch (error) {
      console.error("Erro ao buscar avaliador por e-mail:", error);
      toast.error("Erro ao buscar avaliador por e-mail.");
      return null;
    }
  }

  /** Atualiza a preferência de receber mensagens de um avaliador */
  static async atualizarMensagem(id: string, receber_mensagem: boolean): Promise<Avaliador | null> {
    try {
      const resultado = await AvaliadorRepository.updateMensagem(id, receber_mensagem);
      if (resultado) {
        toast.success("Status Mensagem atualizado com sucesso!");
      }
      return resultado;
    } catch (error) {
      console.error("Erro ao atualizar preferência de mensagens:", error);
      toast.error("Erro ao atualizar preferência de mensagens.");
      return null;
    }
  }
}
