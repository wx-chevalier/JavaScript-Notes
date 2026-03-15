# Pick

`Pick` 是 TypeScript 中一个非常有用的工具类型（Utility Type）。它允许你从一个已有的类型中选择一部分属性来创建一个新的类型。让我们来看看 `Pick` 的定义和使用方法：

1. `Pick` 的定义

`Pick` 的类型定义如下：

```typescript
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

这个定义看起来可能有点复杂，让我们来逐步解析：

- `T` 是源类型，即我们要从中选择属性的类型。
- `K extends keyof T` 表示 `K` 必须是 `T` 的键的子集。
- `[P in K]: T[P]` 是一个映射类型，它遍历 `K` 中的所有属性，并为每个属性创建一个新的属性，其类型与 `T` 中对应属性的类型相同。

2. `Pick` 的使用示例

让我们通过一个例子来看看如何使用 `Pick`：

```typescript
interface Person {
  name: string;
  age: number;
  address: string;
  email: string;
}

type PersonNameAndAge = Pick<Person, "name" | "age">;

// 等同于：
// type PersonNameAndAge = {
//     name: string;
//     age: number;
// }

const john: PersonNameAndAge = {
  name: "John",
  age: 30,
  // address 和 email 不再是必需的
};
```

在这个例子中，我们从 `Person` 接口中选择了 `name` 和 `age` 属性来创建一个新的类型 `PersonNameAndAge`。

3. 更复杂的 `Pick` 用法

`Pick` 可以与其他类型操作符结合使用，创建更复杂的类型：

```typescript
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

// 创建一个类型，只包含 Todo 中的字符串类型属性
type StringPropertyNames<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

type TodoStringProps = Pick<Todo, StringPropertyNames<Todo>>;

// 等同于：
// type TodoStringProps = {
//     title: string;
//     description: string;
// }
```

在这个例子中，我们首先创建了一个 `StringPropertyNames` 类型，它会从一个类型中提取所有字符串类型的属性名。然后我们使用 `Pick` 和这个 `StringPropertyNames` 来创建一个新的类型，这个新类型只包含原始类型中的字符串属性。

理解和熟练使用 `Pick` 类型可以帮助你更灵活地操作和转换类型，从而编写出更精确、更易维护的 TypeScript 代码。

# 案例

```ts
interface Article {
  title: string;
  thumbnail: string;
  content: string;
}

// Creates new type out of the `Article` interface composed
// from the Articles' two properties: `title` and `thumbnail`.
// `ArticlePreview = {title: string; thumbnail: string}`
type ArticlePreview = Pick<Article, "title" | "thumbnail">;

// Render a list of articles using only title and description.
function renderArticlePreviews(previews: ArticlePreview[]): HTMLElement {
  const articles = document.createElement("div");

  for (const preview of previews) {
    // Append preview to the articles.
  }

  return articles;
}

const articles = renderArticlePreviews([
  {
    title: "TypeScript tutorial!",
    thumbnail: "/assets/ts.jpg",
  },
]);
```
