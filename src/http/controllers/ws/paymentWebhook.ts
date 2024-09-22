import { FastifyRequest, FastifyReply } from "fastify";
import { broadcastData } from "./routes"; // Importa a função de broadcast

export async function paymentWebhook(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = req.body;

    if (!body) {
      return reply.status(400).send({ error: "Invalid request body" });
    }

    console.log("Webhook de pagamento recebido:", body);

    // Envia os dados do webhook para todos os clientes WebSocket conectados
    broadcastData({ event: "payment_received", data: body });

    return reply.status(200).send({ success: true, data: body });
  } catch (error) {
    console.error("Erro ao processar o webhook:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
