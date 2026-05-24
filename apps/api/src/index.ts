import { app } from "./app.js";
import { env } from "./config/env.js";

const server = app.listen(env.port, () => {
  console.info(`${env.serviceName} listening on port ${env.port}`);
});

function shutdown(signal: NodeJS.Signals): void {
  console.info(`Received ${signal}; shutting down ${env.serviceName}.`);
  server.close(() => {
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
