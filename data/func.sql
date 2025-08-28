
DECLARE
  candidato uuid;
  fit_score_calc int := 0;
  classificacao_text text;
BEGIN
  -- Pega candidato_id do primeiro item do JSON
  candidato := (respostas_json::jsonb->0->>'candidato_id')::uuid;

  -- Inserir respostas, ignorando duplicadas
  INSERT INTO fitscore_respostas (id, candidato_id, pergunta_id, opcao_id, created_at)
  SELECT
    gen_random_uuid(),
    (elem->>'candidato_id')::uuid,
    (elem->>'pergunta_id')::uuid,
    (elem->>'opcao_id')::uuid,
    now()
  FROM jsonb_array_elements(respostas_json::jsonb) AS elem
  ON CONFLICT (candidato_id, pergunta_id) DO NOTHING;

  -- Calcular fit_score
  SELECT COALESCE(SUM(o.ponto),0)
  INTO fit_score_calc
  FROM jsonb_array_elements(respostas_json::jsonb) AS r
  JOIN fitscore_opcoes o
    ON o.id = (r->>'opcao_id')::uuid;

  -- Determinar classificação
  IF fit_score_calc >= 80 THEN
    classificacao_text := 'Fit Altíssimo';
  ELSIF fit_score_calc >= 60 THEN
    classificacao_text := 'Fit Aprovado';
  ELSIF fit_score_calc >= 40 THEN
    classificacao_text := 'Fit Questionável';
  ELSE
    classificacao_text := 'Fora do Perfil';
  END IF;

  -- Inserir classificação caso ainda não exista
  INSERT INTO fitscore_classificacao (candidato_id, fit_score, classificacao, created_at)
  SELECT candidato, fit_score_calc, classificacao_text, now()
  WHERE NOT EXISTS (
    SELECT 1 FROM fitscore_classificacao WHERE candidato_id = candidato
  );

  -- Atualiza coluna 'conclusao'
  UPDATE candidatos
  SET conclusao = true
  WHERE id = candidato;

  -- Retorna os dados formatados em JSON
  RETURN QUERY
  SELECT json_build_object(
    'email', c.email,
    'nome', c.nome,
    'mensagem_profissional',
       
      'Sua pontuação no Fit Score foi: ' || fit_score_calc || ' (' || classificacao_text || ').' || E'\n' ||
      CASE
          WHEN fit_score_calc >= 80 THEN 'Parabéns! Seu perfil se destacou como Fit Altíssimo. Continuamos muito animados com suas habilidades!'
          WHEN fit_score_calc >= 60 THEN 'Ótimo! Seu perfil foi aprovado no Fit Score. Continue desenvolvendo suas competências para alcançar ainda mais oportunidades.'
          WHEN fit_score_calc >= 40 THEN 'Bom esforço! Seu Fit Score é questionável. Recomendamos continuar aprimorando suas habilidades para melhorar seus resultados futuros.'
          ELSE 'Não desanime! Seu Fit Score está abaixo do esperado, mas ainda existem muitas oportunidades para crescer e se desenvolver profissionalmente.'
      END || E'\n\n' ||
      'Agradecemos sua participação no processo seletivo e esperamos que continue acompanhando nossas oportunidades.'  
      
  )
  FROM candidatos c
  WHERE c.id = candidato;

END;
