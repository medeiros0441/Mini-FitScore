INSERT INTO public.fitscore_perguntas (id, bloco, texto) VALUES
  ('74ff1bea-d205-46b0-a0ed-f1f815f797b9', 'performance', 'Você possui conhecimento em Excel para análise de dados?'),
  ('cae43b59-bf90-4fa0-9844-7253f5ee53d2', 'performance', 'A biblioteca Pandas em Python é utilizada para:'),
  ('4d7d4c57-fcfb-4146-b5ba-140cf9322376', 'performance', 'Qual comando SQL é usado para recuperar dados de uma tabela?'),
  ('823ec1f8-b4a7-4b7a-a624-259563f39c58', 'performance', 'Qual comando cria um novo branch no Git?'),
  ('4397b74a-6e92-477f-a342-7e3d61712ac5', 'energia', 'Como você organiza tarefas para cumprir prazos?'),
  ('99cf52f2-8377-4424-a35f-17ea7195900c', 'energia', 'Como você lida com situações de pressão?'),
  ('3e05a3c0-bf4e-4ba6-9dd7-0859c657b52b', 'cultura', 'Você já reportou um erro seu ou da equipe de forma transparente?'),
  ('2234a891-6b56-438a-a318-c7ddfe2a7080', 'cultura', 'Como você trabalha em equipe?'),
  ('a3c3f0a8-902d-4b1e-9e2d-d306ae1b789f', 'cultura', 'Você propõe melhorias ou novas soluções?'),
  ('d09ebfa0-50bc-4323-8694-bf570d9bf867', 'cultura', 'Como você prioriza a satisfação do cliente/usuário?');



 -- Pergunta 1: Excel
INSERT INTO public.fitscore_opcoes (id, pergunta_id, texto, ponto) VALUES
  (gen_random_uuid(), '74ff1bea-d205-46b0-a0ed-f1f815f797b9', 'Não possuo conhecimento', 3),
  (gen_random_uuid(), '74ff1bea-d205-46b0-a0ed-f1f815f797b9', 'Conhecimento básico (fórmulas simples)', 5),
  (gen_random_uuid(), '74ff1bea-d205-46b0-a0ed-f1f815f797b9', 'Intermediário (tabelas dinâmicas, gráficos)', 8),
  (gen_random_uuid(), '74ff1bea-d205-46b0-a0ed-f1f815f797b9', 'Avançado (modelagem, automação com VBA)', 10);

-- Pergunta 2: Pandas
INSERT INTO public.fitscore_opcoes (id, pergunta_id, texto, ponto) VALUES
  (gen_random_uuid(), 'cae43b59-bf90-4fa0-9844-7253f5ee53d2', 'Manipulação e análise de dados', 10),
  (gen_random_uuid(), 'cae43b59-bf90-4fa0-9844-7253f5ee53d2', 'Criação de interfaces gráficas', 3),
  (gen_random_uuid(), 'cae43b59-bf90-4fa0-9844-7253f5ee53d2', 'Treinamento de redes neurais', 5),
  (gen_random_uuid(), 'cae43b59-bf90-4fa0-9844-7253f5ee53d2', 'Gerenciamento de pacotes', 8);

-- Pergunta 3: SQL
INSERT INTO public.fitscore_opcoes (id, pergunta_id, texto, ponto) VALUES
  (gen_random_uuid(), '4d7d4c57-fcfb-4146-b5ba-140cf9322376', 'SELECT', 10),
  (gen_random_uuid(), '4d7d4c57-fcfb-4146-b5ba-140cf9322376', 'UPDATE', 3),
  (gen_random_uuid(), '4d7d4c57-fcfb-4146-b5ba-140cf9322376', 'DELETE', 5),
  (gen_random_uuid(), '4d7d4c57-fcfb-4146-b5ba-140cf9322376', 'INSERT', 8);

-- Pergunta 4: Git
INSERT INTO public.fitscore_opcoes (id, pergunta_id, texto, ponto) VALUES
  (gen_random_uuid(), '823ec1f8-b4a7-4b7a-a624-259563f39c58', 'git branch new', 3),
  (gen_random_uuid(), '823ec1f8-b4a7-4b7a-a624-259563f39c58', 'git create branch', 5),
  (gen_random_uuid(), '823ec1f8-b4a7-4b7a-a624-259563f39c58', 'git checkout -b', 10),
  (gen_random_uuid(), '823ec1f8-b4a7-4b7a-a624-259563f39c58', 'git init branch', 8);

-- Pergunta 5: Organização de tarefas
INSERT INTO public.fitscore_opcoes (id, pergunta_id, texto, ponto) VALUES
  (gen_random_uuid(), '4397b74a-6e92-477f-a342-7e3d61712ac5', 'Organizo mentalmente, sem ferramentas', 3),
  (gen_random_uuid(), '4397b74a-6e92-477f-a342-7e3d61712ac5', 'Uso anotações simples (papel/bloco de notas)', 5),
  (gen_random_uuid(), '4397b74a-6e92-477f-a342-7e3d61712ac5', 'Uso ferramentas digitais básicas (Trello, Excel)', 8),
  (gen_random_uuid(), '4397b74a-6e92-477f-a342-7e3d61712ac5', 'Utilizo metodologias ágeis (Kanban, Scrum)', 10);

-- Pergunta 6: Situações de pressão
INSERT INTO public.fitscore_opcoes (id, pergunta_id, texto, ponto) VALUES
  (gen_random_uuid(), '99cf52f2-8377-4424-a35f-17ea7195900c', 'Fico muito ansioso e tenho dificuldades', 3),
  (gen_random_uuid(), '99cf52f2-8377-4424-a35f-17ea7195900c', 'Consigo lidar, mas com impacto no desempenho', 5),
  (gen_random_uuid(), '99cf52f2-8377-4424-a35f-17ea7195900c', 'Mantenho a calma e foco no essencial', 8),
  (gen_random_uuid(), '99cf52f2-8377-4424-a35f-17ea7195900c', 'Transformo a pressão em motivação', 10);

-- Pergunta 7: Transparência em erros
INSERT INTO public.fitscore_opcoes (id, pergunta_id, texto, ponto) VALUES
  (gen_random_uuid(), '3e05a3c0-bf4e-4ba6-9dd7-0859c657b52b', 'Nunca reportei', 3),
  (gen_random_uuid(), '3e05a3c0-bf4e-4ba6-9dd7-0859c657b52b', 'Reporto apenas se for grave', 5),
  (gen_random_uuid(), '3e05a3c0-bf4e-4ba6-9dd7-0859c657b52b', 'Sempre reporto, mas com receio', 8),
  (gen_random_uuid(), '3e05a3c0-bf4e-4ba6-9dd7-0859c657b52b', 'Reporto de forma aberta e construtiva', 10);

-- Pergunta 8: Trabalho em equipe
INSERT INTO public.fitscore_opcoes (id, pergunta_id, texto, ponto) VALUES
  (gen_random_uuid(), '2234a891-6b56-438a-a318-c7ddfe2a7080', 'Prefiro trabalhar sozinho', 3),
  (gen_random_uuid(), '2234a891-6b56-438a-a318-c7ddfe2a7080', 'Participo pouco em grupo', 5),
  (gen_random_uuid(), '2234a891-6b56-438a-a318-c7ddfe2a7080', 'Colaboro bem quando solicitado', 8),
  (gen_random_uuid(), '2234a891-6b56-438a-a318-c7ddfe2a7080', 'Sou ativo, colaboro e incentivo o time', 10);

-- Pergunta 9: Propor melhorias
INSERT INTO public.fitscore_opcoes (id, pergunta_id, texto, ponto) VALUES
  (gen_random_uuid(), 'a3c3f0a8-902d-4b1e-9e2d-d306ae1b789f', 'Raramente proponho melhorias', 3),
  (gen_random_uuid(), 'a3c3f0a8-902d-4b1e-9e2d-d306ae1b789f', 'Proponho quando solicitado', 5),
  (gen_random_uuid(), 'a3c3f0a8-902d-4b1e-9e2d-d306ae1b789f', 'Frequentemente trago sugestões', 8),
  (gen_random_uuid(), 'a3c3f0a8-902d-4b1e-9e2d-d306ae1b789f', 'Proponho ativamente e busco implementar', 10);

-- Pergunta 10: Satisfação do cliente
INSERT INTO public.fitscore_opcoes (id, pergunta_id, texto, ponto) VALUES
  (gen_random_uuid(), 'd09ebfa0-50bc-4323-8694-bf570d9bf867', 'Raramente considero a satisfação do cliente', 3),
  (gen_random_uuid(), 'd09ebfa0-50bc-4323-8694-bf570d9bf867', 'Considero apenas se solicitado', 5),
  (gen_random_uuid(), 'd09ebfa0-50bc-4323-8694-bf570d9bf867', 'Levo em conta na maioria das vezes', 8),
  (gen_random_uuid(), 'd09ebfa0-50bc-4323-8694-bf570d9bf867', 'Sempre priorizo e busco exceder expectativas', 10);
