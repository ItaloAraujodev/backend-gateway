/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyRequest, FastifyReply } from "fastify";

// Variável temporária para armazenar clientes WebSocket
const connectedClients: Set<any> = new Set();

// Função que lida com a conexão WebSocket
export function handleWebSocketConnection(connection: any) {
  // Adiciona o cliente WebSocket à lista de clientes conectados
  connectedClients.add(connection);

  // Remove o cliente da lista quando ele se desconectar
  connection.socket.on("close", () => {
    connectedClients.delete(connection);
  });
}

// Função que envia dados para todos os clientes WebSocket conectados
function broadcastPaymentData(data: any) {
  connectedClients.forEach((client) => {
    client.socket.send(JSON.stringify(data));
  });
}

// Webhook que recebe os dados de pagamento
export async function paymentWebhook(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = req.body;

    if (!body) {
      return reply.status(400).send({ error: "Invalid request body" });
    }

    console.log("Received webhook data:", body);

    // Envia os dados de pagamento para todos os clientes WebSocket conectados
    broadcastPaymentData(body);

    return reply.status(200).send({ success: true, data: body });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
