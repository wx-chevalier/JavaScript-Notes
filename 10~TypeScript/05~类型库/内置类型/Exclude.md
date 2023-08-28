# Exclude

```ts
interface ServerConfig {
  port: null | string | number;
}

type RequestHandler = (request: Request, response: Response) => void;

// Exclude `null` type from `null | string | number`.
// In case the port is equal to `null`, we will use default value.
function getPortValue(port: Exclude<ServerConfig["port"], null>): number {
  if (typeof port === "string") {
    return parseInt(port, 10);
  }

  return port;
}

function startServer(handler: RequestHandler, config: ServerConfig): void {
  const server = require("http").createServer(handler);

  const port = config.port === null ? 3000 : getPortValue(config.port);
  server.listen(port);
}
```
