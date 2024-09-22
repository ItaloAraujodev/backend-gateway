import { FastifyInstance } from "fastify";
import { paymentWebhook, sseHandler } from "./paymentWebhook";

export async function paymentWebhookRouter(app: FastifyInstance) {
  app.post("/webhook/payment", paymentWebhook);
  app.get("/webhook/payment/sse", sseHandler);
}
