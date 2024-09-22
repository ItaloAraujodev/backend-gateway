import { FastifyInstance } from "fastify";
import { paymentWebhook } from "./paymentWebhook";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export async function paymentWebhookRouter(app: FastifyInstance) {
  app.post("/webhook/payment", paymentWebhook);

  app.get("/ws", { websocket: true }, (connection) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
    console.log("Cliente conectado ao WebSocket.");

    // Envia uma mensagem de boas-vindas
    connection.send("Bem-vindo ao WebSocket!");

    // Escuta mensagens do cliente
    connection.on("message", (msg) => {
      console.log("Mensagem recebida:", msg.toString());
      // Responde imediatamente, ou ajuste conforme necessário
      connection.send(`Echo: ${msg}`);
    });

    // Escuta o fechamento da conexão
    connection.on("close", () => {
      console.log("Cliente desconectado.");
    });

    // Escuta erros na conexão
    connection.on("error", (error) => {
      console.error("Erro na conexão WebSocket:", error);
    });
  });
}
