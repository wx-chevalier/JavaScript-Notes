# Lowercase

```ts
type T = Lowercase<"HELLO">; // 'hello'

type T2 = Lowercase<"FOO" | "BAR">; // 'foo' | 'bar'

type T3<S extends string> = Lowercase<`aB${S}`>;
type T4 = T3<"xYz">; // 'abxyz'

type T5 = Lowercase<string>; // string
type T6 = Lowercase<any>; // any
type T7 = Lowercase<never>; // never
type T8 = Lowercase<42>; // Error, type 'number' does not satisfy the constraint 'string'
```
