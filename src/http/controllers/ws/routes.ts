import { FastifyInstance } from "fastify";
import { paymentWebhook } from "./paymentWebhook";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const connectedClients: Set<any> = new Set();

export async function paymentWebhookRouter(app: FastifyInstance) {
  app.post("/webhook/payment", paymentWebhook);
  app.get("/ws", { websocket: true }, (connection) => {
    console.log("Cliente conectado ao WebSocket.");

    // Adiciona o cliente WebSocket à lista de clientes conectados
    connectedClients.add(connection);

    // Mensagem de confirmação de conexão
    connection.socket.send("Conectado ao WebSocket com sucesso!");

    // Evento quando uma mensagem é recebida
    connection.socket.on("message", (message) => {
      console.log("Mensagem recebida:", message.toString());

      // Aqui você pode processar a mensagem e, por exemplo, retransmiti-la a todos os clientes
      connectedClients.forEach((client) => {
        if (client !== connection) {
          // Evita ecoar de volta para o remetente
          client.socket.send(`Mensagem do outro cliente: ${message}`);
        }
      });
    });

    // Remover cliente quando a conexão for encerrada
    connection.socket.on("close", () => {
      console.log("Cliente desconectado do WebSocket.");
      connectedClients.delete(connection);
    });
  });
}

export function broadcastData(data: object) {
  connectedClients.forEach((client) => {
    client.socket.send(JSON.stringify(data));
  });
}
