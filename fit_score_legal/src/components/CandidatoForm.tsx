import { useState } from "react";
import { useRouter } from "next/navigation";
import { Candidato } from "@/lib/interface";
import { CandidatoService } from "@/services/CandidatoService";
import { useAuth } from "@/context/AuthProvider";

interface CandidatoFormProps {
  candidatoEdit?: Candidato;
  onSave?: () => void;
}

type CandidatoFormState = Omit<Candidato, "id" | "created_at">;

export default function CandidatoForm({ candidatoEdit, onSave }: CandidatoFormProps) {
  const router = useRouter();
  const { usuario, setUsuarioContext } = useAuth(); // pegando o context corretamente

  const [candidato, setCandidato] = useState<CandidatoFormState>({
    nome: candidatoEdit?.nome ?? "",
    email: candidatoEdit?.email ?? "",
    conclusao: candidatoEdit?.conclusao ?? false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await CandidatoService.criar({
      nome: candidato.nome,
      email: candidato.email,
      conclusao: false,
    });

    if (!result) return;

    setUsuarioContext(result);
    if (result.conclusao === false) {
      router.push("/quiz");
    } else {
      router.push("/conclusao");
    }

    if (onSave) onSave();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md flex flex-col gap-4"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="nome" className="font-semibold text-gray-700">
          Nome
        </label>
        <input
          id="nome"
          type="text"
          placeholder="Nome"
          value={candidato.nome}
          onChange={(e) => setCandidato({ ...candidato, nome: e.target.value })}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="font-semibold text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={candidato.email}
          onChange={(e) => setCandidato({ ...candidato, email: e.target.value })}
          required
          className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white font-bold py-2 my-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Continuar
      </button>
    </form>
  );
}
