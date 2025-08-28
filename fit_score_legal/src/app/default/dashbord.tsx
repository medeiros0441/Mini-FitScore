"use client";

import { useEffect, useState } from "react";
import { ListaClassificacao } from "@/lib/interface";
import { FitScoreClassificacaoService } from "@/services/FitScoreClassificacaoService";
import { Loader, Star, CheckCircle, AlertCircle, XCircle, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthProvider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { getRelatorio } from "@/lib/request";
import { toast } from "sonner";
import { AvaliadorService } from "@/services/AvaliadorService";
import {  useRouter } from "next/navigation";

export default function Dashboard() {
  const [lista, setLista] = useState<ListaClassificacao[]>([]);
  const [loading, setLoading] = useState(true);
  const { reset, usuario, loadUsuario } = useAuth();
  const router = useRouter();

  const [busca, setBusca] = useState("");
  const [filtroClassificacao, setFiltroClassificacao] = useState("Todos");

  useEffect(() => {
    const fetchClassificacao = async () => {
      try {
        const dados = await FitScoreClassificacaoService.listarClassificacoes();
        setLista(dados);
      } catch (error) {
        console.error("Erro ao carregar classificações:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClassificacao();
  }, []);


    if (!usuario) {
      router.push("/avaliador");
    }

  const updateMensagens = async (value: boolean) => {
    if (!usuario?.id) {
      toast.error("Usuário não identificado.");
      return;
    }

    try {
      await AvaliadorService.atualizarMensagem(usuario.id, value);
      loadUsuario(); // Recarrega os dados do usuário
    } catch (error) {
      console.error("Erro ao atualizar mensagens:", error);
      toast.error("Erro ao solicitar relatório. Tente novamente mais tarde.");
    }
  };

  const listaFiltrada = lista.filter((item) => {
    const matchBusca =
      item.nome.toLowerCase().includes(busca.toLowerCase()) ||
      item.email.toLowerCase().includes(busca.toLowerCase());
    const matchClassificacao =
      filtroClassificacao === "Todos" || item.classificacao === filtroClassificacao;
    return matchBusca && matchClassificacao;
  });

  const resumo = lista.reduce(
    (acc, item) => {
      if (item.classificacao === "Fit Altíssimo") acc.altissimo++;
      else if (item.classificacao === "Fit Aprovado") acc.aprovado++;
      else if (item.classificacao === "Fit Questionável") acc.questionavel++;
      else if (item.classificacao === "Fora do Perfil") acc.fora++;
      return acc;
    },
    { altissimo: 0, aprovado: 0, questionavel: 0, fora: 0 }
  );

  const getIcon = (classificacao: string) => {
    switch (classificacao) {
      case "Fit Altíssimo":
        return <Star className="w-6 h-6 text-blue-600" />;
      case "Fit Aprovado":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "Fit Questionável":
        return <AlertCircle className="w-6 h-6 text-yellow-600" />;
      case "Fora do Perfil":
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return null;
    }
  };

  const gerarRelatorio = async () => {
    try {
      const status = await getRelatorio(usuario?.id);
      if (status) {
        toast.success("Relatório solicitado com sucesso! Verifique seu e-mail.");
      } else {
        toast.error("Erro ao solicitar relatório. Tente novamente mais tarde.");
      }
    } catch (error) {
      toast.error("Erro ao solicitar relatório. Tente novamente mais tarde.");
      console.error(error);
    }
  };

  return (
<div className="  w-full  p-6 space-y-6 bg-gray-50 mx-auto">
      {/* ====== HEADER ====== */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full mb-8 gap-4">
        <div className="flex flex-col min-w-0">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Mini Dashboard - Avaliações
          </h1>
          <p className="text-gray-600">
            Visão geral das classificações e detalhes de cada candidato
          </p>
        </div>
      </header>

      {/* ====== INFO & AÇÕES DO USUÁRIO ====== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full border-b pb-3 border-gray-200 bg-white shadow-md hover:shadow-xl transition-shadow duration-300 px-4 py-3 rounded-lg">
        {/* Nome e email */}
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-gray-900 truncate">{usuario?.nome}</span>
          <span className="text-gray-500 text-sm truncate">{usuario?.email}</span>
        </div>

        {/* Toggle de relatórios */}
        <div className="flex items-center gap-3">
          <span className="text-gray-700 text-sm font-medium">Receber Relatórios no E-mail</span>
          <button
            onClick={() => updateMensagens(!usuario?.receber_mensagem)}
            className={`relative inline-flex items-center h-6 w-14 rounded-full transition-colors duration-300 ${
              usuario?.receber_mensagem
                ? "bg-gradient-to-r from-green-400 to-green-500 shadow-inner"
                : "bg-gray-300 shadow-sm"
            } hover:brightness-105`}
          >
            <span
              className={`inline-block w-6 h-6 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
                usuario?.receber_mensagem ? "translate-x-8" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Ações gerais */}
        <div className="flex gap-2 flex-wrap">

         { usuario?.receber_mensagem && (
          <Button
            variant="outline"
            size="sm"
            onClick={gerarRelatorio}
            className="flex items-center gap-1 border-blue-500 text-blue-600 hover:bg-blue-50 hover:shadow transition-all duration-200"
          >
            Relatório
          </Button>)}
          <Button
            variant="destructive"
            size="sm"
            onClick={reset}
            className="flex items-center gap-1 hover:bg-red-600 hover:shadow-lg transition-all duration-200"
          >
            <LogOut className="w-4 h-4" /> Sair
          </Button>
        </div>
      </div>

      {/* ====== CARDS DE RESUMO ====== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <ResumoCard icone={<Star className="w-8 h-8 text-blue-600" />} titulo="Fit Altíssimo" count={resumo.altissimo} cor="blue" />
        <ResumoCard icone={<CheckCircle className="w-8 h-8 text-green-600" />} titulo="Fit Aprovado" count={resumo.aprovado} cor="green" />
        <ResumoCard icone={<AlertCircle className="w-8 h-8 text-yellow-600" />} titulo="Fit Questionável" count={resumo.questionavel} cor="yellow" />
        <ResumoCard icone={<XCircle className="w-8 h-8 text-red-600" />} titulo="Fora do Perfil" count={resumo.fora} cor="red" />
      </section>

      {/* ====== FILTROS ====== */}
      <section className="flex flex-col sm:flex-row items-center gap-4 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Buscar por nome ou e-mail..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition truncate"
        />
        <Select value={filtroClassificacao} onValueChange={setFiltroClassificacao}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Todas as classificações" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Todos">Todas as classificações</SelectItem>
            <SelectItem value="Fit Altíssimo">Fit Altíssimo</SelectItem>
            <SelectItem value="Fit Aprovado">Fit Aprovado</SelectItem>
            <SelectItem value="Fit Questionável">Fit Questionável</SelectItem>
            <SelectItem value="Fora do Perfil">Fora do Perfil</SelectItem>
          </SelectContent>
        </Select>
      </section>

      {/* ====== LISTA DE AVALIAÇÕES ====== */}
      <section className="max-w-6xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 py-12">
            <Loader className="animate-spin w-5 h-5" />
            <span>Carregando dados...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {listaFiltrada.length > 0 ? (
              listaFiltrada.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl hover:scale-[1.02] transition transform flex flex-col items-center gap-4"
                >
                  {/* Ícone + índice */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="relative flex justify-center items-center">{getIcon(item.classificacao)}</div>
                    <span className="text-gray-500 text-sm font-medium">#{idx + 1}</span>
                  </div>

                  {/* Nome e email */}
                  <div className="text-center min-w-0">
                    <span className="font-semibold text-gray-700 truncate">{item.nome}</span>
                    <p className="text-gray-500 text-sm truncate">{item.email}</p>
                  </div>

                  {/* FitScore */}
                  <div className="text-center font-bold text-blue-600">FitScore: {item.fitscore}</div>

                  {/* Classificação */}
                  <div className="text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.classificacao === "Fit Aprovado"
                          ? "bg-green-100 text-green-700"
                          : item.classificacao === "Fora do Perfil"
                          ? "bg-red-100 text-red-700"
                          : item.classificacao === "Fit Altíssimo"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.classificacao}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-400 italic">
                Nenhum registro encontrado
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

// ====== COMPONENTE CARD DE RESUMO ======
interface ResumoCardProps {
  icone: React.ReactNode;
  titulo: string;
  count: number;
  cor: "blue" | "green" | "yellow" | "red";
}

const ResumoCard = ({ icone, titulo, count, cor }: ResumoCardProps) => (
  <div className={`bg-${cor}-50 p-5 rounded-xl shadow-md flex flex-col items-center gap-2 transition transform hover:shadow-xl hover:scale-[1.03] duration-300`}>
    {icone}
    <span className="text-gray-700 font-semibold truncate">{titulo}</span>
    <span className={`text-2xl font-bold text-${cor}-700`}>{count}</span>
  </div>
);
