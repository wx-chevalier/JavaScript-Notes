## 可空类型（Nullable Types）

可空类型允许我们明确地处理 `null` 或 `undefined` 值。

```typescript
type Nullable<T> = T | null | undefined;

function process(value: Nullable<string>) {
  if (value != null) {
    console.log(value.toUpperCase());
  }
}
```
