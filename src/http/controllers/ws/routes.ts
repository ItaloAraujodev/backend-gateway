import { FastifyInstance } from "fastify";
import { paymentWebhook } from "./paymentWebhook";

export async function paymentWebhookRouter(app: FastifyInstance) {
  app.post("/webhook/payment", paymentWebhook);
}
