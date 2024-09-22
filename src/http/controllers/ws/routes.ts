import { FastifyInstance } from "fastify";
import { paymentWebhook } from "./paymentWebhook";
import { handleWebSocketConnection } from "./handleWebSocketConnection";

export async function paymentWebhookRouter(app: FastifyInstance) {
  app.post("/webhook/payment", paymentWebhook);
  app.get("/ws", { websocket: true }, handleWebSocketConnection);
}
