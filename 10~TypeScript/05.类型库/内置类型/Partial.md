# Partial

```ts
interface NodeConfig {
  appName: string;
  port: number;
}

class NodeAppBuilder {
  private configuration: NodeConfig = {
    appName: "NodeApp",
    port: 3000,
  };

  private updateConfig<Key extends keyof NodeConfig>(
    key: Key,
    value: NodeConfig[Key]
  ) {
    this.configuration[key] = value;
  }

  config(config: Partial<NodeConfig>) {
    type NodeConfigKey = keyof NodeConfig;

    for (const key of Object.keys(config) as NodeConfigKey[]) {
      const updateValue = config[key];

      if (updateValue === undefined) {
        continue;
      }

      this.updateConfig(key, updateValue);
    }

    return this;
  }
}

// `Partial<NodeConfig>`` allows us to provide only a part of the
// NodeConfig interface.
new NodeAppBuilder().config({ appName: "ToDoApp" });
```
