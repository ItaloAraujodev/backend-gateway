import { payment } from "@/lib/mercadoPago";
import { FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { paymentCreatedSchema } from "./Schema/paymentCreatedSchema";

export async function paymentCreatedPixController(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  try {
    const { email, price } = paymentCreatedSchema.parse(req.body);

    const requestOptions = { idempotencyKey: uuidv4() };

    const body = {
      payer: {
        email,
      },
      payment_method_id: "pix", // Define o método de pagamento como Pix
      transaction_amount: price, // Valor da transação
      notification_url:
        "https://webhook.site/1468ea90-8ab1-44af-ad7b-a2e4c740f886", // URL de notificação
    };

    const response = await payment.create({ body, requestOptions });

    if (!response || response.api_response.status !== 201) {
      throw new Error("Falha na criação de pagamento");
    }

    return reply.status(201).send(response);
  } catch (error) {
    console.error("Erro ao criar pagamento via Pix:", error);

    return reply.status(500).send({
      error: "Erro ao processar a solicitação de pagamento",
      details: error instanceof Error ? error.message : error,
    });
  }
}
