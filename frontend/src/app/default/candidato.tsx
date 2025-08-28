"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Candidato as ICandidato } from "@/lib/interface";
import { CandidatoService } from "@/services/CandidatoService";
import { useAuth } from "@/context/AuthProvider";

type CandidatoFormState = Omit<ICandidato, "id" | "created_at">;

export default function Candidato() {
  const router = useRouter();
  const { setUsuarioContext } = useAuth();

  const [candidato, setCandidato] = useState<CandidatoFormState>({
    nome: "",
    email: "",
    conclusao: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await CandidatoService.criar({
      nome: candidato.nome,
      email: candidato.email,
      conclusao: false,
    });

    if (!result) return;

    // Atualiza contexto com o usuário criado
    setUsuarioContext(result);

    // Redireciona de acordo com a conclusão
    router.push(result.conclusao ? "/conclusao" : "/quiz");
  };

  return (
    <div className="  flex items-center justify-center   p-6">
      <form
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-4">
          Cadastro de Candidato
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Preencha seus dados para iniciar o processo de avaliação.
        </p>

        <div className="flex flex-col gap-4 mb-2">
          <label htmlFor="nome" className="font-semibold text-gray-700">
            Nome
          </label>
          <input
            id="nome"
            type="text"
            placeholder="Digite seu nome"
            value={candidato.nome}
            onChange={(e) =>
              setCandidato({ ...candidato, nome: e.target.value })
            }
            required
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm hover:shadow-md"
          />
        </div>

        <div className="flex flex-col gap-4">
          <label htmlFor="email" className="font-semibold text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Digite seu email"
            value={candidato.email}
            onChange={(e) =>
              setCandidato({ ...candidato, email: e.target.value })
            }
            required
            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition shadow-sm hover:shadow-md"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-blue-600 text-white float-end font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg text-lg"
        >
          Continuar
        </button>
      </form>
    </div>
  );
}
