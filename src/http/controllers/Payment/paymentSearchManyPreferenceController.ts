/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest, FastifyReply } from "fastify";
import { preference } from "@/lib/mercadoPago";

export async function paymentSearchManyPreferenceController(
  _req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  try {
    const options = {
      offset: 0,
      limit: 5,
    };

    const searched = await preference.search({ options });

    if (!searched || (searched as any).api_response.status !== 200) {
      throw new Error("Falha ao buscar preferências de pagamento");
    }

    return reply.status(200).send({
      message: "Preferências de pagamento encontradas",
      ...searched,
    });
  } catch (error) {
    // Tratamento de erros e log
    console.error("Erro ao buscar preferências de pagamento:", error);

    // Retorna um erro adequado para o cliente
    return reply.status(500).send({
      error: "Erro ao buscar preferências de pagamento",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
