## 联合类型（Union Types）

联合类型表示一个值可以是几种类型之一。

```typescript
type Combinable = string | number;

function add(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}
```
