## 类型守卫（Type Guards）

类型守卫是一些表达式，它们会在运行时检查以确保在某个作用域里的类型。

```typescript
function isString(test: any): test is string {
  return typeof test === "string";
}

function example(x: number | string) {
  if (isString(x)) {
    console.log(x.toUpperCase()); // x is treated as string here
  } else {
    console.log(x.toFixed(2)); // x is treated as number here
  }
}
```
