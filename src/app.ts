import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "process";
import { Server } from "node:http";
import { paymentRouter } from "./http/controllers/Payment/routes";
import { paymentWebhookRouter } from "./http/controllers/ws/routes";
import websocketPlugin from "@fastify/websocket";
import cors from "@fastify/cors";

export const app = fastify();

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Acc"],
});

app.register(websocketPlugin);
app.register(paymentRouter);
app.register(paymentWebhookRouter);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  return reply.status(500).send({ message: "Internal server error" });
});

declare module "fastify" {
  export interface FastifyInstance {
    io: Server<never>;
  }
}
