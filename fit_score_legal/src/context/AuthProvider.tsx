"use client";
import { createContext, useContext, useEffect, useState, ReactNode,useCallback } from "react";
import { Usuario } from "@/lib/interface";
import { getUsuario, setUsuario as setUsuarioStorage, removeUsuario } from "@/lib/localStorage";
import { CandidatoService } from "@/services/CandidatoService";
import { AvaliadorService } from "@/services/AvaliadorService";

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  setUsuarioContext: (usuario: Usuario) => void;
  reset: () => void;
  loadUsuario: () => Promise<void>; // adiciona aqui
}

interface AuthContextType {
  usuario: Usuario | null;
  loading: boolean;
  setUsuarioContext: (usuario: Usuario) => void;
  reset: () => void;
  loadUsuario: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  loading: true,
  setUsuarioContext: () => {},
  reset: () => {},
  loadUsuario: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuarioState] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUsuario = useCallback(async () => {
    setLoading(true);
    const storedUsuario = getUsuario() as Partial<Usuario> | null;

    if (!storedUsuario) {
      setUsuarioState(null);
      setLoading(false);
      return;
    }

    try {
      let fullUsuario: Usuario;

      if (storedUsuario.tipo === "candidato") {
        const candidato = await CandidatoService.getByEmail(storedUsuario.email!);
        fullUsuario = {
          id: candidato?.id ?? storedUsuario.id ?? "",
          nome: candidato?.nome ?? storedUsuario.nome ?? "",
          email: candidato?.email ?? storedUsuario.email ?? "",
          created_at: candidato?.created_at ?? storedUsuario.created_at ?? new Date().toISOString(),
          tipo: "candidato",
          conclusao: candidato?.conclusao ?? storedUsuario.conclusao ?? false,
        };
      } else {
        const avaliador = await AvaliadorService.getByEmail(storedUsuario.email!);
        fullUsuario = {
          id: avaliador?.id ?? storedUsuario.id ?? "",
          nome: avaliador?.nome ?? storedUsuario.nome ?? "",
          email: avaliador?.email ?? storedUsuario.email ?? "",
          created_at: avaliador?.created_at ?? new Date().toISOString(),
          tipo: "avaliador",
          receber_mensagem: avaliador?.receber_mensagem ?? storedUsuario.receber_mensagem ?? false,
          conclusao: false,
        };
      }

      setUsuarioState(fullUsuario);
      setUsuarioStorage(fullUsuario);
    } catch {
      setUsuarioState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;
    if (ativo) loadUsuario();
    return () => {
      ativo = false;
    };
  }, [loadUsuario]);

  const setUsuarioContext = (usuario: Usuario) => {
    setUsuarioState(usuario);
    setUsuarioStorage(usuario);
  };

  const reset = () => {
    setUsuarioState(null);
    removeUsuario();
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, setUsuarioContext, reset, loadUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
