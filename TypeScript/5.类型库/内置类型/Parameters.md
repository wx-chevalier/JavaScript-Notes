# Parameters

```ts
function shuffle(input: any[]): void {
  // Mutate array randomly changing its' elements indexes.
}

function callNTimes<Fn extends (...arguments_: any[]) => any>(
  func: Fn,
  callCount: number
) {
  // Type that represents the type of the received function parameters.
  type FunctionParameters = Parameters<Fn>;

  return function (...arguments_: FunctionParameters) {
    for (let i = 0; i < callCount; i++) {
      func(...arguments_);
    }
  };
}

const shuffleTwice = callNTimes(shuffle, 2);
```

# ConstructorParameters

```ts
class ArticleModel {
  title: string;
  content?: string;

  constructor(title: string) {
    this.title = title;
  }
}

class InstanceCache<T extends new (...arguments_: any[]) => any> {
  private ClassConstructor: T;
  private cache: Map<string, InstanceType<T>> = new Map();

  constructor(ctr: T) {
    this.ClassConstructor = ctr;
  }

  getInstance(...arguments_: ConstructorParameters<T>): InstanceType<T> {
    const hash = this.calculateArgumentsHash(...arguments_);

    const existingInstance = this.cache.get(hash);
    if (existingInstance !== undefined) {
      return existingInstance;
    }

    return new this.ClassConstructor(...arguments_);
  }

  private calculateArgumentsHash(...arguments_: any[]): string {
    // Calculate hash.
    return "hash";
  }
}

const articleCache = new InstanceCache(ArticleModel);
const amazonArticle = articleCache.getInstance("Amazon forests burining!");
```
