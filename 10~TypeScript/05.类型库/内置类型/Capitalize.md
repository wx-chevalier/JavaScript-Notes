# Capitalize

```ts
type T = Capitalize<"hello">; // 'Hello'

type T2 = Capitalize<"foo" | "bar">; // 'Foo' | 'Bar'

type T3<S extends string> = Capitalize<`aB${S}`>;
type T4 = T3<"xYz">; // 'ABxYz'

type T5 = Capitalize<string>; // string
type T6 = Capitalize<any>; // any
type T7 = Capitalize<never>; // never
type T8 = Capitalize<42>; // Error, type 'number' does not satisfy the constraint 'string'
```
