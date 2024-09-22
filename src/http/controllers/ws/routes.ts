import { FastifyInstance } from "fastify";
import { paymentWebhook } from "./paymentWebhook";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export async function paymentWebhookRouter(app: FastifyInstance) {
  app.post("/webhook/payment", paymentWebhook);
  app.get("/ws", { websocket: true }, (connection) => {
    console.log("Cliente conectado ao WebSocket.");

    // Envia uma mensagem de boas-vindas ao cliente conectado
    connection.socket.send("Bem-vindo ao WebSocket!");

    // Mantém o cliente ouvindo e recebe mensagens do cliente
    connection.socket.on("message", (message) => {
      console.log("Mensagem recebida do cliente:", message.toString());
    });

    // Quando a conexão é fechada
    connection.socket.on("close", () => {
      console.log("Cliente desconectado.");
    });

    // Caso ocorra algum erro
    connection.socket.on("error", (error) => {
      console.error("Erro na conexão WebSocket:", error);
    });
  });
}
