# 交叉类型（Intersection Types）

交叉类型将多个类型合并为一个类型。

```typescript
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "Max",
  privileges: ["create-server"],
  startDate: new Date(),
};
```

7. 索引类型（Index Types）

索引类型允许你使用动态属性名。

```typescript
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map((n) => o[n]);
}

interface Car {
  manufacturer: string;
  model: string;
  year: number;
}

let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014,
};

let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);
```

8. 类型推断（Type Inference）

TypeScript 可以在很多情况下推断类型，无需明确的类型注解。

```typescript
let x = 3; // TypeScript infers that x is a number
```

9. 字面量类型（Literal Types）

字面量类型允许你指定一个值必须是特定的字面量。

```typescript
type Easing = "ease-in" | "ease-out" | "ease-in-out";

function animate(dx: number, dy: number, easing: Easing) {
  // ...
}

animate(0, 0, "ease-in");
// animate(0, 0, "linear"); // Error: Argument of type '"linear"' is not assignable to parameter of type 'Easing'.
```

10. 模板字面量类型（Template Literal Types）

模板字面量类型建立在字符串字面量类型上，通过联合类型进行扩展。

```typescript
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
// type AllLocaleIDs = "welcome_email_id" | "email_heading_id" | "footer_title_id" | "footer_sendoff_id"
```

这些高级类型可以组合使用，创建更复杂和精确的类型定义。理解和熟练使用这些高级类型可以帮助你更好地利用 TypeScript 的类型系统，编写更安全、更可维护的代码。

理解了，你是在寻找一些更复杂、实用的 TypeScript 类型用法。这里有一些更高级的 TypeScript 类型技巧和模式，这些在实际开发中经常会用到：

1. 递归类型

递归类型可以用来定义具有任意嵌套深度的数据结构：

```typescript
type NestedArray<T> = Array<T | NestedArray<T>>;

const arr: NestedArray<number> = [1, [2, 3, [4, 5]], 6, [7, [8, 9]]];
```

2. 条件类型与 infer

使用 `infer` 关键字在条件类型中推断类型：

```typescript
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

function foo(x: number): string {
  return x.toString();
}

type FooReturn = ReturnType<typeof foo>; // string
```

3. 映射类型与键重映射

使用映射类型和键重映射来转换对象类型：

```typescript
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface Person {
  name: string;
  age: number;
}

type PersonGetters = Getters<Person>;
// {
//   getName: () => string;
//   getAge: () => number;
// }
```

4. 条件类型分配

条件类型在联合类型上是分配的：

```typescript
type ToArray<T> = T extends any ? T[] : never;

type StrArrOrNumArr = ToArray<string | number>;
// string[] | number[]
```

5. 元组类型与可变元组

使用元组类型和展开操作符：

```typescript
type Tuple = [number, string, boolean];

type Push<T extends any[], U> = [...T, U];
type PushedTuple = Push<Tuple, null>; // [number, string, boolean, null]

type Pop<T extends any[]> = T extends [...infer U, any] ? U : never;
type PoppedTuple = Pop<Tuple>; // [number, string]
```

6. 类型体操：字符串操作

使用条件类型和递归来操作字符串类型：

```typescript
type StringToUnion<S extends string> = S extends `${infer C}${infer R}`
  ? C | StringToUnion<R>
  : never;

type T1 = StringToUnion<"hello">; // "h" | "e" | "l" | "o"
```

7. 深度 Partial

创建一个递归的 Partial 类型：

```typescript
type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

interface A {
  b: {
    c: string;
    d: number;
  };
}

type PartialA = DeepPartial<A>;
// {
//   b?: {
//     c?: string | undefined;
//     d?: number | undefined;
//   } | undefined;
// }
```

8. 提取函数参数类型

从函数类型中提取参数类型：

```typescript
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;

function foo(a: number, b: string): void {}

type FooParams = Parameters<typeof foo>; // [number, string]
```

9. 类型安全的事件发射器

使用泛型和映射类型创建类型安全的事件发射器：

```typescript
type EventMap = {
  click: { x: number; y: number };
  focus: undefined;
};

class TypedEventEmitter<T extends Record<string, any>> {
  on<K extends keyof T>(eventName: K, handler: (data: T[K]) => void): void {
    // 实现省略
  }

  emit<K extends keyof T>(eventName: K, data: T[K]): void {
    // 实现省略
  }
}

const emitter = new TypedEventEmitter<EventMap>();

emitter.on("click", (data) => {
  console.log(data.x, data.y);
});

emitter.emit("click", { x: 10, y: 20 });
```

这些例子展示了 TypeScript 类型系统的强大功能。它们可以帮助你创建更精确、更灵活的类型定义，从而提高代码的类型安全性和可读性。在实际项目中，这些技术可以用来构建复杂的类型定义，解决各种类型相关的问题。
