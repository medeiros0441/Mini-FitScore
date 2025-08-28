-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.candidatos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  nome text NOT NULL UNIQUE,
  email text NOT NULL DEFAULT ''::text UNIQUE,
  conclusao boolean NOT NULL DEFAULT false,
  CONSTRAINT candidatos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.fitscore_classificacao (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  candidato_id uuid NOT NULL,
  fit_score integer,
  classificacao text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fitscore_classificacao_pkey PRIMARY KEY (id),
  CONSTRAINT fitscore_classificacao_candidato_id_fkey FOREIGN KEY (candidato_id) REFERENCES public.candidatos(id)
);
CREATE TABLE public.fitscore_opcoes (
  pergunta_id uuid DEFAULT gen_random_uuid(),
  texto text,
  ponto smallint,
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  CONSTRAINT fitscore_opcoes_pkey PRIMARY KEY (id),
  CONSTRAINT fitscore_opcoes_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.fitscore_perguntas(id)
);
CREATE TABLE public.fitscore_perguntas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  bloco character varying,
  texto text,
  CONSTRAINT fitscore_perguntas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.fitscore_respostas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  candidato_id uuid NOT NULL,
  pergunta_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  opcao_id uuid DEFAULT gen_random_uuid(),
  CONSTRAINT fitscore_respostas_pkey PRIMARY KEY (id),
  CONSTRAINT fitscore_respostas_candidato_id_fkey FOREIGN KEY (candidato_id) REFERENCES public.candidatos(id),
  CONSTRAINT fitscore_respostas_pergunta_id_fkey FOREIGN KEY (pergunta_id) REFERENCES public.fitscore_perguntas(id),
  CONSTRAINT fitscore_respostas_opcao_id_fkey FOREIGN KEY (opcao_id) REFERENCES public.fitscore_opcoes(id)
);
 CREATE TABLE avaliadores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text NOT NULL, -- formato internacional, ex: +5511999999999
  receber_mensagem boolean DEFAULT true -- indica se o avaliador quer receber mensagens
);
