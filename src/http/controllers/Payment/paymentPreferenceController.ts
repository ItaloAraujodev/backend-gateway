import { FastifyRequest, FastifyReply } from "fastify";
import { preference } from "@/lib/mercadoPago";

export async function paymentSearchPreferenceController(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  try {
    // Extrai o ID da preferência dos parâmetros da URL
    const { id } = req.params as { id: string };

    // Verifica se o ID foi fornecido
    if (!id) {
      return reply.status(400).send({
        error: "ID da preferência é obrigatório",
      });
    }

    // Busca a preferência de pagamento usando o ID fornecido
    const response = await preference.get({ preferenceId: id });

    // Verifica se a resposta da API do Mercado Pago foi bem-sucedida
    if (!response || response.api_response.status !== 200) {
      throw new Error("Falha ao buscar a preferência de pagamento");
    }

    // Envia a preferência de pagamento encontrada
    return reply.status(200).send({
      message: "Preferência de pagamento encontrada",
      preference: response,
    });
  } catch (error) {
    // Tratamento de erros e log
    console.error("Erro ao buscar preferência de pagamento:", error);

    // Retorna um erro adequado para o cliente
    return reply.status(500).send({
      error: "Erro ao buscar a preferência de pagamento",
      details: error instanceof Error ? error.message : error,
    });
  }
}
