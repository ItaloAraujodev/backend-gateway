import { payment } from "@/lib/mercadoPago";
import { FastifyRequest, FastifyReply } from "fastify";

export async function searchPaymentController(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  try {
    const { id } = req.params as { id: string };

    if (!id) {
      return reply.status(400).send({
        error: "ID do pagamento é obrigatório",
      });
    }

    const response = await payment.get({ id });

    if (!response || response.api_response.status !== 200) {
      throw new Error("Falha ao buscar o pagamento");
    }

    return reply.status(200).send({
      message: "Pagamento encontrado",
      payment: response,
    });
  } catch (error) {
    // Tratamento de erros e log
    console.error("Erro ao buscar pagamento:", error);

    return reply.status(500).send({
      error: "Erro ao buscar o pagamento",
      details: error instanceof Error ? error.message : error,
    });
  }
}
