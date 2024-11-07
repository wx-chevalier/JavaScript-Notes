> DocId: sskwlZ

# Neverthrow 使用教程

## 1. 基础设置

### 1.1 安装

```bash
# npm
npm install neverthrow

# yarn
yarn add neverthrow

# pnpm
pnpm add neverthrow
```

### 1.2 基本导入

```typescript
import { Result, ok, err } from "neverthrow";
```

## 2. 基础用法

### 2.1 创建 Result

```typescript
// 成功结果
const successResult: Result<number, Error> = ok(42);

// 失败结果
const errorResult: Result<number, Error> = err(
  new Error("Something went wrong")
);

// 类型推断
const success = ok(42); // Result<number, never>
const failure = err("error"); // Result<never, string>
```

### 2.2 基本方法使用

```typescript
// 示例函数：除法运算
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err("Division by zero");
  }
  return ok(a / b);
}

// 使用结果
const result = divide(10, 2);

// 检查是否成功
if (result.isOk()) {
  console.log("Result:", result.value);
}

// 检查是否失败
if (result.isErr()) {
  console.log("Error:", result.error);
}

// 使用 match 方法
result.match(
  (value) => console.log("Success:", value),
  (error) => console.log("Error:", error)
);
```

## 3. 链式操作

### 3.1 map 和 mapErr

```typescript
// map: 转换成功值
const result = ok(5)
  .map((n) => n * 2)
  .map((n) => n.toString());
// Result<string, never>

// mapErr: 转换错误值
const error = err("error").mapErr((e) => new Error(e));
// Result<never, Error>
```

### 3.2 chain (flatMap)

```typescript
function fetchUser(id: number): Result<User, Error> {
  // 模拟获取用户
  return ok({ id, name: "John" });
}

function fetchUserPosts(user: User): Result<Post[], Error> {
  // 模拟获取用户帖子
  return ok([{ id: 1, title: "Post 1" }]);
}

// 链式调用
const result = fetchUser(1).chain((user) => fetchUserPosts(user));
// 结果类型: Result<Post[], Error>
```

## 4. 高级用法

### 4.1 组合多个 Result

```typescript
import { combine, combineWithAllErrors } from "neverthrow";

// 组合多个结果（遇到第一个错误就停止）
const results = combine([ok(1), ok(2), ok(3)]);
// Result<number[], Error>

// 组合并收集所有错误
const results2 = combineWithAllErrors([ok(1), err("error1"), err("error2")]);
// Result<number[], string[]>
```

### 4.2 异步操作

```typescript
import { ResultAsync } from "neverthrow";

// 创建异步 Result
const asyncResult = ResultAsync.fromPromise(
  fetch("https://api.example.com/data"),
  (e) => new Error(`API Error: ${e}`)
);

// 链式处理
asyncResult
  .map((response) => response.json())
  .map((data) => data.items)
  .match(
    (items) => console.log("Items:", items),
    (error) => console.error("Error:", error)
  );
```

### 4.3 自定义错误类型

```typescript
// 定义错误类型
type ApiError =
  | { type: "NOT_FOUND"; message: string }
  | { type: "UNAUTHORIZED"; message: string };

// 使用自定义错误类型
function fetchData(): Result<string, ApiError> {
  // ... 实现逻辑
  return err({ type: "NOT_FOUND", message: "Resource not found" });
}
```

## 5. 实际应用示例

### 5.1 表单验证

```typescript
type ValidationError = {
  field: string;
  message: string;
};

function validateEmail(email: string): Result<string, ValidationError> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email)
    ? ok(email)
    : err({ field: "email", message: "Invalid email format" });
}

function validatePassword(password: string): Result<string, ValidationError> {
  return password.length >= 8
    ? ok(password)
    : err({ field: "password", message: "Password too short" });
}

// 组合验证
function validateForm(email: string, password: string) {
  return combine([validateEmail(email), validatePassword(password)]).map(
    ([validEmail, validPassword]) => ({
      email: validEmail,
      password: validPassword,
    })
  );
}
```

### 5.2 API 请求处理

```typescript
interface User {
  id: number;
  name: string;
}

class ApiClient {
  async fetchUser(id: number): ResultAsync<User, Error> {
    return ResultAsync.fromPromise(
      fetch(`/api/users/${id}`).then((r) => r.json()),
      (error) => new Error(`Failed to fetch user: ${error}`)
    );
  }

  async updateUser(user: User): ResultAsync<User, Error> {
    return ResultAsync.fromPromise(
      fetch(`/api/users/${user.id}`, {
        method: "PUT",
        body: JSON.stringify(user),
      }).then((r) => r.json()),
      (error) => new Error(`Failed to update user: ${error}`)
    );
  }
}

// 使用示例
const api = new ApiClient();

api
  .fetchUser(1)
  .chain((user) => api.updateUser({ ...user, name: "Updated Name" }))
  .match(
    (updatedUser) => console.log("User updated:", updatedUser),
    (error) => console.error("Error:", error)
  );
```

### 5.3 业务逻辑处理

```typescript
interface Order {
  id: number;
  userId: number;
  total: number;
}

class OrderService {
  validateOrder(order: Order): Result<Order, string> {
    if (order.total <= 0) {
      return err("Order total must be positive");
    }
    if (!order.userId) {
      return err("Order must have a user");
    }
    return ok(order);
  }

  processPayment(order: Order): Result<string, Error> {
    // 模拟支付处理
    return ok(`Payment processed for order ${order.id}`);
  }

  createOrder(orderData: Order) {
    return this.validateOrder(orderData)
      .chain((order) => this.processPayment(order))
      .map((paymentResult) => ({
        success: true,
        payment: paymentResult,
      }));
  }
}
```

## 6. 最佳实践

1. **始终指定错误类型**

```typescript
// 好的做法
function doSomething(): Result<number, MyError> {
  // ...
}

// 避免
function doSomething(): Result<number, any> {
  // ...
}
```

2. **使用类型别名简化复杂类型**

```typescript
type ApiResult<T> = Result<T, ApiError>;
type AsyncApiResult<T> = ResultAsync<T, ApiError>;
```

3. **合理使用错误转换**

```typescript
someResult
  .mapErr((error) => new CustomError(error))
  .chain((value) => anotherOperation(value));
```

通过使用 neverthrow，我们可以更优雅地处理错误，使代码更加健壮和可维护。记住要根据实际需求选择合适的方法和模式。
