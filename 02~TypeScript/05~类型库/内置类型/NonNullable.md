# NonNullable

条件类型根据一个条件表达式来选择两种可能类型之一。

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type Result = NonNullable<string | null | undefined>; // Result is string
```

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
