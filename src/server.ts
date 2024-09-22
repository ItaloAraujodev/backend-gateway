import { app } from "./app";
import { env } from "./env";

const port = Number(env.PORT);

app
  .listen({
    host: "0.0.0.0",
    port,
  })
  .then(() => {
    console.log(`HTTP Server Running! PORT: ${env.PORT}`);
  })
  .catch((err) => {
    console.error(`Error starting server: ${err}`);
  });
