// src/lib/interface.ts
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  created_at: string;
  tipo: "candidato" | "avaliador"; // nova propriedade
  conclusao: boolean;           // relevante para candidato
  receber_mensagem?: boolean;    // relevante para avaliador
}


export interface Candidato {
  id: string;
  nome: string;
  email: string;
  created_at: string;
  conclusao: boolean;
}

export interface Avaliador {
  id?: string; 
  nome: string;
  email: string;
  created_at?: string;
  receber_mensagem?: boolean;  
}
export interface FitScoreClassificacao {
  id?: number;
  candidato_id: string;
  fit_score?: number;
  classificacao?: string;
  created_at?: string;
}

export interface FitScoreOpcao {
  id: string;
  pergunta_id: string;
  texto?: string;
  ponto?: number;
}
export interface FitScorePergunta {
  id: string;
  bloco?: string;
  texto?: string;
  opcoes: FitScoreOpcao[];
  valor?: string; 
}

export interface FitScoreResposta {
  id?: string;
  candidato_id: string;
  pergunta_id: string;
  opcao_id?: string;
  created_at?: string;
}
 
/// variaveis auxiliares

export interface PerguntaOpcao {
  id: string;
  texto: string;
}

export interface PerguntaBloco {
  id: string;
  pergunta: string;
  opcoes: PerguntaOpcao[];
}

export interface PerguntasPorBloco {
  [bloco: string]: Record<string, PerguntaBloco>;
}

// Tipos do banco
export interface PerguntaDB {
  id: string;
  bloco: string;
  texto: string;
}

 export interface OpcaoDB {
  id: string;
  pergunta_id: string;
  texto: string;
}

export interface PerguntasJson {
  performance: Record<string, FitScorePergunta>;
  energia: Record<string, FitScorePergunta>;
  cultura: Record<string, FitScorePergunta>;
}

export interface PerguntaSessao {
  bloco: keyof PerguntasJson;
  id: string;
  dados: FitScorePergunta;
}

export interface ListaClassificacao {
  nome: string;
  email: string;
  fitscore: number;
  classificacao: string;
}
 