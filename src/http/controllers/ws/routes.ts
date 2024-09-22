import { FastifyInstance } from "fastify";
import { paymentWebhook } from "./paymentWebhook";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectedClients: Set<any> = new Set();

export async function paymentWebhookRouter(app: FastifyInstance) {
  app.post("/webhook/payment", paymentWebhook);

  app.get("/ws", { websocket: true }, (connection) => {
    console.log("Cliente conectado ao WebSocket.");
    connectedClients.add(connection);

    // Mensagem de boas-vindas ao cliente
    connection.send("Bem-vindo ao WebSocket!");

    // Evento quando o cliente se desconecta
    connection.on("close", () => {
      console.log("Cliente desconectado.");
      connectedClients.delete(connection); // Remove o cliente da lista
    });

    // Escuta por erros
    connection.on("error", (error) => {
      console.error("Erro na conexão WebSocket:", error);
    });
  });

  app.post("/ws/send", async (req, reply) => {
    const body = req.body;

    if (!body) {
      return reply.status(400).send({ error: "Invalid request body" });
    }

    console.log("Webhook recebido:", body);

    // Envia a mensagem recebida para todos os clientes conectados
    connectedClients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        console.log(client);
        client.send(JSON.stringify(body));
      }
    });

    return reply.status(200).send({ success: true, data: body });
  });
}
