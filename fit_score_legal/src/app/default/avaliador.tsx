"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AvaliadorService } from "@/services/AvaliadorService";
import { useAuth } from "@/context/AuthProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AvaliadorForm {
  nome: string;
  email: string;
}

const CadastrarAvaliadorPage = () => {
  const { setUsuarioContext } = useAuth(); // pegando o setter do context
  const [avaliador, setAvaliador] = useState<AvaliadorForm>({ nome: "", email: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvaliador({ ...avaliador, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!avaliador.nome || !avaliador.email) {
      toast.warning("Preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      // Chama o serviço que já retorna o usuário completo
      const usuario = await AvaliadorService.criar({
        nome: avaliador.nome,
        email: avaliador.email,
      });

      if (usuario) {
        setUsuarioContext(usuario);  
        setAvaliador({ nome: "", email: "" });
        router.push("/dashboard");
      } else {
        toast.error("Erro ao cadastrar avaliador.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro desconhecido");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm  aling- p-8 bg-white g space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">
          Cadastrar Avaliador
        </h2>

        <div className="space-y-3">
          <Label htmlFor="nome" className="text-gray-700 font-medium">
            Nome
          </Label>
          <Input
            type="text"
            id="nome"
            name="nome"
            value={avaliador.nome}
            onChange={handleChange}
            placeholder="Digite o nome do avaliador"
            className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md shadow-sm transition"
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="email" className="text-gray-700 font-medium">
            Email
          </Label>
          <Input
            type="email"
            id="email"
            name="email"
            value={avaliador.email}
            onChange={handleChange}
            placeholder="Digite o email do avaliador"
            className="border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 rounded-md shadow-sm transition"
          />
        </div>

        <Button
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Cadastrando..." : "Cadastrar"}
        </Button>

      
      </form>
  );
};

export default CadastrarAvaliadorPage;
