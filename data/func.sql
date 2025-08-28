create or replace function inserir_respostas_e_classificacao(
  respostas_json json
)
returns boolean
language plpgsql
as $$
declare
  candidato uuid;
  fit_score int := 0;
  classificacao_text text;
begin
  -- Pega candidato_id do primeiro item do JSON
  candidato := (respostas_json::jsonb->0->>'candidato_id')::uuid;

  -- Inserir respostas, ignorando duplicadas (mesmo candidato e pergunta)
  insert into fitscore_respostas (id, candidato_id, pergunta_id, opcao_id, created_at)
  select
    gen_random_uuid(),
    (elem->>'candidato_id')::uuid,
    (elem->>'pergunta_id')::uuid,
    (elem->>'opcao_id')::uuid,
    now()
  from jsonb_array_elements(respostas_json::jsonb) as elem
  on conflict (candidato_id, pergunta_id) do nothing;

  raise notice 'Respostas inseridas (duplicadas ignoradas) para o candidato %', candidato;

  -- Calcular fit_score somando pontos das opções válidas
  select coalesce(sum(o.ponto),0)
  into fit_score
  from jsonb_array_elements(respostas_json::jsonb) as r
  join fitscore_opcoes o
    on o.id = (r->>'opcao_id')::uuid;

  raise notice 'Fit Score calculado: %', fit_score;

  -- Determinar classificação
  if fit_score >= 80 then
    classificacao_text := 'Fit Altíssimo';
  elsif fit_score >= 60 then
    classificacao_text := 'Fit Aprovado';
  elsif fit_score >= 40 then
    classificacao_text := 'Fit Questionável';
  else
    classificacao_text := 'Fora do Perfil';
  end if;

  raise notice 'Classificação determinada: %', classificacao_text;

  -- Inserir classificação caso ainda não exista
  insert into fitscore_classificacao (candidato_id, fit_score, classificacao, created_at)
  select candidato, fit_score, classificacao_text, now()
  where not exists (
    select 1 from fitscore_classificacao where candidato_id = candidato
  );

  raise notice 'Classificação inserida (se não existia) para o candidato %', candidato;

  -- Atualiza a coluna 'conclusao' para true (ou 1) no candidato
  update candidatos
  set conclusao = true
  where id = candidato;

  raise notice 'Candidato % finalizado (conclusao = true)', candidato;

  return true;
end;
$$;
