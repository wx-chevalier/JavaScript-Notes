# Readonly

```ts
enum LogLevel {
  Off,
  Debug,
  Error,
  Fatal,
}

interface LoggerConfig {
  name: string;
  level: LogLevel;
}

class Logger {
  config: Readonly<LoggerConfig>;

  constructor({ name, level }: LoggerConfig) {
    this.config = { name, level };
    Object.freeze(this.config);
  }
}

const config: LoggerConfig = {
  name: "MyApp",
  level: LogLevel.Debug,
};

const logger = new Logger(config);

// TypeScript Error: cannot assign to read-only property.
logger.config.level = LogLevel.Error;

// We are able to edit config variable as we please.
config.level = LogLevel.Error;
```
