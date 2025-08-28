"use client";

import { useRouter } from "next/navigation";
import { User, UserCheck } from "lucide-react";

export default function EscolhaUsuarioPage() {
  const router = useRouter();

  const handleEscolha = (tipo: "candidato" | "avaliador") => {
    router.push(tipo === "candidato" ? "/candidato" : "/avaliador");
  };

  return (
    <div  >
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-12 text-gray-900 text-center">
        Escolha seu perfil
      </h1>

      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-1xl">
        {/* Candidato */}
        <button
          onClick={() => handleEscolha("candidato")}
          className="flex-1 flex flex-col items-center gap-4 p-8 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-300"
          aria-label="Escolher perfil de candidato"
        >
          <User className="w-12 h-12" />
          <span className="text-xl font-semibold">Candidato</span>
          <p className="text-center text-sm text-blue-100">
            Faça seu cadastro e participe do processo de avaliação.
          </p>
        </button>

        {/* Avaliador */}
        <button
          onClick={() => handleEscolha("avaliador")}
          className="flex-1 flex flex-col items-center gap-4 p-8 bg-green-600 text-white rounded-2xl shadow-lg hover:bg-green-700 transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-300"
          aria-label="Escolher perfil de avaliador"
        >
          <UserCheck className="w-12 h-12" />
          <span className="text-xl font-semibold">Avaliador</span>
          <p className="text-center text-sm text-green-100">
            Acesse seu painel e avalie candidatos de forma prática e rápida.
          </p>
        </button>
      </div>

      <p className="mt-10 text-gray-500 text-center text-sm sm:text-base">
        Escolha uma opção para continuar para a sua área.
      </p>
    </div>
  );
}
