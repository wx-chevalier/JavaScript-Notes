# InstanceType

```ts
class IdleService {
  doNothing(): void {}
}

class News {
  title: string;
  content: string;

  constructor(title: string, content: string) {
    this.title = title;
    this.content = content;
  }
}

const instanceCounter: Map<Function, number> = new Map();

interface Constructor {
  new (...arguments_: any[]): any;
}

// Keep track how many instances of `Constr` constructor have been created.
function getInstance<
  Constr extends Constructor,
  Arguments extends ConstructorParameters<Constr>
>(constructor: Constr, ...arguments_: Arguments): InstanceType<Constr> {
  let count = instanceCounter.get(constructor) || 0;

  const instance = new constructor(...arguments_);

  instanceCounter.set(constructor, count + 1);

  console.log(`Created ${count + 1} instances of ${Constr.name} class`);

  return instance;
}

const idleService = getInstance(IdleService);
// Will log: `Created 1 instances of IdleService class`
const newsEntry = getInstance(
  News,
  "New ECMAScript proposals!",
  "Last month..."
);
// Will log: `Created 1 instances of News class`
```
