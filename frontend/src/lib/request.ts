import axios from "axios";

const handleError = (error: unknown) => {
  console.error("Erro na requisição:", error);
  return false;
};
// URL base do n8n vindo do .env
const N8N_BASE_URL = process.env.NEXT_PUBLIC_N8N_BASE_URL;
if (!N8N_BASE_URL) {
  throw new Error("A variável de ambiente N8N_BASE_URL não está definida.");
}

// Enviar dados para o webhook de Fit Score Respostas
export const enviarFitScoreRespostas = async (payload: unknown): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${N8N_BASE_URL}/webhook/fit-score-respostas`,
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    // Retorna true se a mensagem esperada foi recebida
    return response.data?.message === "Workflow was started";
  } catch (error: unknown) {
    return handleError(error);
  }
};

export const getRelatorio = async (payload: unknown): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${N8N_BASE_URL}/webhook/get-relatorio`,
        [{ avaliador_id: payload }], 
      { headers: { "Content-Type": "application/json" } }
    );

    // Retorna true se a mensagem esperada foi recebida
    return response.data?.message === "Workflow was started";
  } catch (error: unknown) {
    console.error("Erro ao solicitar relatório:", error);
    // Retorna false em caso de erro
    return false;
  }
};