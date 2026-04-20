# Uppercase

```ts
type T = Uppercase<"hello">; // 'HELLO'

type T2 = Uppercase<"foo" | "bar">; // 'FOO' | 'BAR'

type T3<S extends string> = Uppercase<`aB${S}`>;
type T4 = T3<"xYz">; // 'ABXYZ'

type T5 = Uppercase<string>; // string
type T6 = Uppercase<any>; // any
type T7 = Uppercase<never>; // never
type T8 = Uppercase<42>; // Error, type 'number' does not satisfy the constraint 'string'
```
