import { FastifyInstance } from "fastify";
import { paymentWebhook } from "./paymentWebhook";

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export async function paymentWebhookRouter(app: FastifyInstance) {
  app.post("/webhook/payment", paymentWebhook);
  app.get("/ws", { websocket: true }, (connection) => {
    console.log("Cliente conectado ao WebSocket.");

    // Envia uma mensagem de boas-vindas ao cliente conectado
    connection.socket.send("Bem-vindo ao WebSocket!");

    // Mantém a conexão ativa
    connection.socket.on("message", (msg) => {
      console.log("Mensagem recebida:", msg.toString());
      connection.socket.send(`Echo: ${msg}`);
    });

    connection.socket.on("close", () => {
      console.log("Cliente desconectado.");
      connection.socket.send("Desconectado do WebSocket.");
    });

    connection.socket.on("error", (error) => {
      console.error("Erro na conexão WebSocket:", error);
    });
  });
}
