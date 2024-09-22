import { preference } from "@/lib/mercadoPago";
import { FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";
import { paymentCreatedSchema } from "./Schema/paymentCreatedSchema";
import { generateProductHash } from "@/utils/generateProductHash";
import { env } from "@/env";

export async function paymentCreatedController(
  req: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply | void> {
  try {
    const { title, email, price } = paymentCreatedSchema.parse(req.body);

    const requestOptions = { idempotencyKey: uuidv4() };

    const response = await preference.create({
      body: {
        notification_url: env.WEBHOOK_URL, // URL do webhook para notificações
        external_reference: generateProductHash(), // Referência externa única para rastrear o pagamento
        payer: {
          email,
        },
        payment_methods: {
          excluded_payment_methods: [
            {
              id: "bolbradesco", // Exclui a opção de pagamento via boleto
            },
          ],
          installments: 1, // Limita o número de parcelas a 1
        },
        items: [
          {
            id: uuidv4(), // ID único para o item
            title, // Título do item
            quantity: 1, // Quantidade (sempre 1 no seu caso)
            unit_price: price, // Preço unitário
          },
        ],
      },
      requestOptions, // Garante que a requisição é idempotente
    });

    if (!response || response.api_response.status !== 201) {
      throw new Error("Falha na criação da preferência de pagamento");
    }

    return reply.status(201).send({
      message: "Preferência de pagamento criada com sucesso",
      preference: response,
    });
  } catch (error) {
    console.error("Erro ao criar preferência de pagamento:", error);

    return reply.status(500).send({
      error: "Erro ao processar a solicitação de pagamento",
      details: error instanceof Error ? error.message : error,
    });
  }
}
