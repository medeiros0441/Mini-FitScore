import { CandidatoRepository } from "@/repository/CandidatoRepository";
import { Usuario, Candidato } from "@/lib/interface";
import { toast } from "sonner"; // ou "react-toastify"

export class CandidatoService {
  /** Cria um novo candidato ou retorna o existente se o e-mail já estiver cadastrado */
  static async criar(candidato: Omit<Candidato, "id" | "created_at">): Promise<Usuario | null> {
    try {
      const exists = await CandidatoRepository.emailExist(candidato.email);

      if (exists) {
        toast.warning("E-mail já cadastrado.");
        const candidatoExistente = await CandidatoRepository.getByEmail(candidato.email);
        if (candidatoExistente) {
          const usuario: Usuario = {
            id: candidatoExistente.id,
            nome: candidatoExistente.nome,
            email: candidatoExistente.email,
            created_at: candidatoExistente.created_at,
            tipo: "candidato",
            conclusao: candidatoExistente.conclusao,
          };
          return usuario;
        }
        return null;
      }

      const resultado = await CandidatoRepository.insert(candidato); // retorna Candidato[]
      const novoCandidato = resultado[0] ?? null;

      if (novoCandidato) {
        const usuario: Usuario = {
          id: novoCandidato.id,
          nome: novoCandidato.nome,
          email: novoCandidato.email,
          created_at: novoCandidato.created_at,
          tipo: "candidato",
          conclusao: novoCandidato.conclusao,
        };
        toast.success("Candidato criado com sucesso!");
        return usuario;
      }

      return null;
    } catch (error) {
      console.error("Erro ao criar candidato:", error);
      toast.error("Erro ao criar candidato.");
      return null;
    }
  }

  /** Verifica se um e-mail já existe */
  static async emailExist(email: string): Promise<boolean> {
    try {
      return await CandidatoRepository.emailExist(email);
    } catch (error) {
      console.error("Erro ao verificar e-mail:", error);
      toast.error("Erro ao verificar e-mail.");
      return false;
    }
  }

  /** Busca candidato por e-mail */
  static async getByEmail(email: string): Promise<Usuario | null> {
    try {
      const candidato = await CandidatoRepository.getByEmail(email);
      if (!candidato) return null;

      const usuario: Usuario = {
        id: candidato.id,
        nome: candidato.nome,
        email: candidato.email,
        created_at: candidato.created_at,
        tipo: "candidato",
        conclusao: candidato.conclusao,
      };
      return usuario;
    } catch (error) {
      console.error("Erro ao buscar candidato por e-mail:", error);
      toast.error("Erro ao buscar candidato por e-mail.");
      return null;
    }
  }
}
