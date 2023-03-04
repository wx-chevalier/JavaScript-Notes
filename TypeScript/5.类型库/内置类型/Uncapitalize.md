# Uncapitalize

```ts
type T = Uncapitalize<"Hello">; // 'hello'

type T2 = Uncapitalize<"Foo" | "Bar">; // 'foo' | 'bar'

type T3<S extends string> = Uncapitalize<`AB${S}`>;
type T4 = T3<"xYz">; // 'aBxYz'

type T5 = Uncapitalize<string>; // string
type T6 = Uncapitalize<any>; // any
type T7 = Uncapitalize<never>; // never
type T8 = Uncapitalize<42>; // Error, type 'number' does not satisfy the constraint 'string'
```
