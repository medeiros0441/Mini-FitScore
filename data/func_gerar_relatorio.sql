WITH aprovados AS (
    SELECT 
        c.nome AS candidato_nome,
        c.email AS candidato_email,
        f.fit_score,
        f.classificacao
    FROM fitscore_classificacao f
    INNER JOIN candidatos c
        ON f.candidato_id = c.id
    WHERE f.fit_score >= 80
      AND f.created_at >= NOW() - INTERVAL '12 hours'
)
SELECT 
    (
        SELECT json_agg(
            json_build_object(
                'email', av.email,
                'nome', av.nome,
                'mensagem', 
                    'Olá ' || av.nome || ',' || chr(10) || chr(10) ||
                    'Segue a lista de candidatos aprovados no Fit Score nas últimas 12 horas.' || chr(10)  
            )
        )
        FROM avaliadores av
        WHERE av.receber_mensagem = true
          {{ 
            (() => {
                const id = $json?.body?.[0]?.avaliador_id;
                return id ? "AND av.id = '" + id + "'" : "";
            })()
        }}
    ) AS avaliadores,
    
    (
        SELECT json_agg(
            json_build_object(
                'nome', ap.candidato_nome,
                'email', ap.candidato_email,
                'escore', ap.fit_score,
                'classificacao', ap.classificacao
            )
        )
        FROM aprovados ap
    ) AS candidatos;
