# NonNullable

```ts
type PortNumber = string | number | null;

/** Part of a class definition that is used to build a server */
class ServerBuilder {
  portNumber!: NonNullable<PortNumber>;

  port(this: ServerBuilder, port: PortNumber): ServerBuilder {
    if (port == null) {
      this.portNumber = 8000;
    } else {
      this.portNumber = port;
    }

    return this;
  }
}

const serverBuilder = new ServerBuilder();

serverBuilder
  .port("8000") // portNumber = '8000'
  .port(null) // portNumber =  8000
  .port(3000); // portNumber =  3000

// TypeScript error
serverBuilder.portNumber = null;
```
