"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { ArrowLeft, ArrowRight, CheckCircle,    CircleQuestionMark } from "lucide-react";
import {  FitScorePerguntasService } from "@/services/FitScorePerguntasService";
import { FitScoreRespostaService } from "@/services/FitScoreRespostaService";
import { toast } from "sonner";
import LoadingScreen from "@/components/LoadingScreen";

import type { 
  FitScoreResposta, 
  FitScoreOpcao, 
  FitScorePergunta, 
  PerguntaBloco, 
  PerguntaOpcao, 
  PerguntasPorBloco ,PerguntasJson, PerguntaSessao
} from "@/lib/interface";
import { TrendingUp, Zap, Users } from "lucide-react";

const icones = {
  performance: <TrendingUp className="w-7 h-7 text-blue-600" />,
  energia: <Zap className="w-7 h-7 text-yellow-500" />,
  cultura: <Users className="w-7 h-7 text-green-600" />,
};
// Transformar JSON em lista de sessões
const gerarSessaoPerguntas = (json: PerguntasJson): PerguntaSessao[] =>
  (Object.keys(json) as (keyof PerguntasJson)[]).flatMap(bloco =>
    Object.entries(json[bloco]).map(([id, dados]) => ({ bloco, id, dados }))
  );
 
function mapBloco(bloco: Record<string, PerguntaBloco>): Record<string, FitScorePergunta> {
  const resultado: Record<string, FitScorePergunta> = {};

  // Percorre cada pergunta do bloco
  Object.values(bloco).forEach((p: PerguntaBloco) => {
    if (!p || !p.id) {
      console.warn("Pergunta inválida detectada e ignorada:", p);
      return; // pula perguntas inválidas
    }

    // Garante que as opções estão presentes
    const opcoesSeguras: FitScoreOpcao[] = (p.opcoes ?? []).map((o: PerguntaOpcao) => {
      if (!o || !o.id) {
        console.warn(`Opção inválida na pergunta ${p.id} detectada e ignorada:`, o);
        return null; // marcar como nulo para filtrar depois
      }
      return {
        ...o,
        pergunta_id: p.id,
      };
    }).filter(Boolean) as FitScoreOpcao[];

    // Adiciona a pergunta mapeada ao resultado
    resultado[p.id] = {
      id: p.id,
      texto: p.pergunta,
      opcoes: opcoesSeguras,
      valor: undefined, // inicializa sem resposta
    };
  });

  return resultado;
}


function mapParaFitScore(perguntas: PerguntasPorBloco): PerguntasJson {
  return {
    performance: mapBloco(perguntas.performance),
    energia: mapBloco(perguntas.energia),
    cultura: mapBloco(perguntas.cultura),
  };
}



export default function Quiz() {
  const { usuario: authCandidato, loading: authLoading ,loadUsuario} = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [sessaoLoading, setSessaoLoading] = useState(false);
  const [perguntasJson, setPerguntasJson] = useState<PerguntasJson | null>(null);
  const [sessaoAtual, setSessaoAtual] = useState(0);

  // Carregar perguntas
  useEffect(() => {
    let ativo = true;
    const carregarPerguntas = async () => {
      setLoading(true);
      try {
        const dados = await FitScorePerguntasService.listar();
        if (!ativo) return;

        setPerguntasJson(mapParaFitScore(dados));
      } catch (err) {
        console.error("Erro perguntas:", err);
        if (ativo) setPerguntasJson({ performance: {}, energia: {}, cultura: {} });
      } finally {
        if (ativo) setLoading(false);
      }
    };

    carregarPerguntas();
    return () => { ativo = false; };
  }, []);

  if (loading || !perguntasJson) return (
       <LoadingScreen message="Carregando usuário..." />
  );

  if (authLoading) return (
    <LoadingScreen message="Carregando usuário..." />
  );

  // Redirecionar se já finalizado ou usuário inexistente
  if (!authCandidato || authCandidato.conclusao) {
    router.push("/");
    return null;
  }

  const sessoes = gerarSessaoPerguntas(perguntasJson);
  const sessao = sessoes[sessaoAtual];

  if (!sessao) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500">Nenhuma pergunta disponível.</p>
    </div>
  );

  // Atualizar valor temporário
  const handleChange = (bloco: keyof PerguntasJson, perguntaId: string, opcaoId: string) => {
    setPerguntasJson(prev => prev && ({
      ...prev,
      [bloco]: {
        ...prev[bloco],
        [perguntaId]: {
          ...prev[bloco][perguntaId],
          valor: opcaoId,
        },
      },
    }));
  };

  // Próxima sessão
  const handleProximo = () => {
    if (!sessao.dados.valor) {
      toast.warning("Selecione uma opção antes de continuar.");
      return;
    }
    setSessaoLoading(true);
    setTimeout(() => {
      setSessaoAtual(prev => Math.min(prev + 1, sessoes.length - 1));
      setSessaoLoading(false);
    }, 600);
  };

  // Sessão anterior
  const handleAnterior = () => setSessaoAtual(prev => Math.max(prev - 1, 0));

  // Enviar respostas
  const enviarRespostas = async () => {
    if (!authCandidato || !perguntasJson) return;
    const respostas: FitScoreResposta[] = (Object.keys(perguntasJson) as (keyof PerguntasJson)[])
      .flatMap(bloco =>
        Object.values(perguntasJson[bloco]).map((pergunta) => ({
          pergunta_id: pergunta.id,
          opcao_id: pergunta.valor || "",
          candidato_id: authCandidato.id,
        }))
      );

    const status = await FitScoreRespostaService.criarFitScoreResposta(respostas);
      loadUsuario();
    if (status) router.push("/conclusao");
  };
return (
    <div className="  w-full max-w-md   ">

   <h1 className="flex items-center justify-center gap-2 text-3xl font-[var(--font-roboto-mono)] border-b border-gray-950 mb-6 text-gray-800">
      {icones[sessao.bloco]}
      {sessao.bloco.toUpperCase()}
    </h1>

        {/* Sessão Perguntas */}
        <div className="w-full min-h-[200px] flex flex-col justify-center">
          {sessaoLoading ? (
           <LoadingScreen message="Carregando próxima pergunta..." />
          ) : (
            <>
              

           <div className="mb-4 flex   gap-2 text-gray-700 font-medium leading-relaxed items-center">
              <CircleQuestionMark className="w-10 h-10 flex-shrink-0 text-green-500    " />
              <span>{sessao.dados.texto}</span>
            </div>

              {/* Opções */}
              <div className="space-y-3 w-full">
                {sessao.dados.opcoes.map((opcao: FitScoreOpcao) => {
                  const isSelected = sessao.dados.valor === opcao.id;

                  return (
                    <label
                      key={opcao.id}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all shadow-sm
                        ${
                          isSelected
                            ? "bg-blue-400 text-white border-blue-400 shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-400"
                        }`}
                    >
                      <input
                        type="radio"
                        name={`${sessao.bloco}-${sessao.id}`}
                        value={opcao.id}
                        checked={isSelected}
                        onChange={() => handleChange(sessao.bloco, sessao.id, opcao.id)}
                        className="hidden"
                      />
                      <span
                        className={`w-5 h-5 flex items-center justify-center rounded-full border-2 transition-colors
                          ${isSelected
                            ? "bg-white border-white"
                            : "border-gray-400"
                          }`}
                      >
                        {isSelected && <div className="w-3 h-3 bg-blue-400 rounded-full" />}
                      </span>
                      <span className="font-medium">{opcao.texto}</span>
                    </label>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Botões Navegação */}
        <div className="flex justify-between mt-6 w-full">
          <button
            onClick={handleAnterior}
            disabled={sessaoAtual === 0 || sessaoLoading}
            className={`px-2   rounded-lg font-semibold flex items-center transition border
              ${sessaoAtual === 0 || sessaoLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-200 text-white hover:bg-blue-700"
              }`}
          >
            <ArrowLeft className="w-5 h-5  " />  
          </button>

          <button
            onClick={sessaoAtual < sessoes.length - 1 ? handleProximo : enviarRespostas}
            disabled={sessaoLoading}
            className={`px-5 py-2 rounded-lg font-semibold flex items-center transition
              ${sessaoAtual < sessoes.length - 1
                ? "bg-blue-400 text-white hover:bg-blue-600"
                : "bg-green-600 text-white hover:bg-green-700"
              }`}
          >
            {sessaoAtual < sessoes.length - 1 ? (
              <>
                Continuar <ArrowRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Finalizar Quiz <CheckCircle className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>

    </div>
);
}