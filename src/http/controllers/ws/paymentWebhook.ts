import { FastifyRequest, FastifyReply } from "fastify";

let clients: FastifyReply[] = [];

// Função para adicionar cliente SSE
function addClient(client: FastifyReply) {
  clients.push(client);
  client.raw.on("close", () => {
    clients = clients.filter((c) => c !== client);
  });
}

// Função para enviar dados do webhook aos clientes conectados
function sendToClients(data: object) {
  clients.forEach((client) => {
    client.raw.write(`data: ${JSON.stringify(data)}\n\n`);
  });
}

// Rota SSE para o Frontend conectar-se e receber dados em tempo real
export async function sseHandler(req: FastifyRequest, reply: FastifyReply) {
  reply
    .header("Content-Type", "text/event-stream")
    .header("Cache-Control", "no-cache")
    .header("Connection", "keep-alive")
    .status(200);

  reply.raw.write("\n"); // Inicia a conexão SSE
  addClient(reply); // Adiciona cliente à lista de conexões
}

// Webhook que recebe dados de pagamento e envia aos clientes conectados
export async function paymentWebhook(req: FastifyRequest, reply: FastifyReply) {
  try {
    const body = req.body;

    if (!body) {
      return reply.status(400).send({ error: "Invalid request body" });
    }

    console.log("Received webhook data:", body);

    // Enviar dados do webhook para todos os clientes conectados via SSE
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendToClients(body as any);

    return reply.status(200).send({ success: true, data: body });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
