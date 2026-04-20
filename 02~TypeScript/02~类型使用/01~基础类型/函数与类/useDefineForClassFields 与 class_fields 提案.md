# 从 TS 的 useDefineForClassFields 选项到 class-fields 提案

useDefineForClassFields 是 TypeScript 3.7.0 中新增的一个编译选项（详见 PR），启用后的作用是将 class 声明中的字段语义从 [[Set]] 变更到 [[Define]]。我们考虑如下代码：

```ts
class C {
  foo = 100;
  bar: string;
}
```

这是长期以来很常见的一种 TS 字段声明方式，默认情况下它的[编译结果](https://link.zhihu.com/?target=https%3A//www.typescriptlang.org/play%3F%23code/MYGwhgzhAEDC0G8CwAoa0BmB7L0C80AjAAzEDcq6ARmAE4Bc0EALrQJYB2A5hSgL5A)如下：

```ts
class C {
  constructor() {
    this.foo = 100;
  }
}
```

当启用了 `useDefineForClassFields` 编译选项后它的[编译结果](https://link.zhihu.com/?target=https%3A//www.typescriptlang.org/play%3FuseDefineForClassFields%3Dtrue%23code/MYGwhgzhAEDC0G8CwAoa0BmB7L0C80AjAAzEDcq6ARmAE4Bc0EALrQJYB2A5hSgL5A)如下：

```ts
class C {
  constructor() {
    Object.defineProperty(this, "foo", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 100,
    });
    Object.defineProperty(this, "bar", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0,
    });
  }
}
```

可以看到变化主要由如下两点：

1. 字段声明的方式从 `=` 赋值的方式变更成了 `Object.defineProperty`
2. 所有的字段声明都会生效，即使它没有指定默认值

默认 `=` 赋值的方式就是所谓的 `[[Set]]` 语义，因为 `this.foo = 100` 这个操作会隐式地调用上下文中 `foo` 的 `setter`。相应地 `Object.defineProperty` 的方式即所谓的 `[[Define]]` 语义。

在没有 `setter` 相关的 `class` 中两种语义使用上基本没有区别，但一旦和 `setter` 或继承混合使用时不同的语义就会产生截然不同的效果。

考虑如下代码：

```ts
class Base {
  value: number | string;

  set data(value: string) {
    console.log("data changed to " + value);
  }

  constructor(value: number | string) {
    this.value = value;
  }
}

class Derived extends Base {
  // 当使用 `useDefineForClassFields` 时 `value` 将在调用 `super()` 后
  // 被初始化为 `undefined`，即使你传入了正确的 `value` 值
  value: number;

  // 当使用 `useDefineForClassFields` 时
  // `console.log` 将不再被触发
  data = 10;

  constructor(value: number) {
    super(value);
  }
}

const derived = new Derived(5);
```

# class-fields 提案的选择

对于字段声明默认赋值为 `undefined` 相对能获得认可，毕竟是显式地声明了一个字段并且未赋值，类似于不同层级的代码块中声明 `let value: number`，内层的 `value` 会默认重新创建一个值为 `undefined` 的标识符，因此 TS 中也提供了 `declare field` 的新语法来支持声明字段但不产生实际代码的用法。

```text
class Derived extends Base {
  // 即使启用了 `useDefineForClassFields` 也不会覆盖初始化为 `undefined`
  declare value: number;
}
```

但初次接触到新的 `[[Define]]` 语义可能会觉得不可理喻，社区内也有[很大的分歧](https://link.zhihu.com/?target=https%3A//github.com/tc39/proposal-class-fields/issues/151%23issuecomment-431597270)，但实际上 TC39 最终选择了 `[[Define]]` 语义自然有他们的考虑。

在上面的例子中，如果是 `[[Set]]` 语义，`data` 的 `setter` 被正确触发，但 `Derived` 的实例上并不会拥有一个值为 `10` 的 `data` 属性，即 `derived.hasOwnProperty('data') === false` 且 `derived.data === undefined`，这『可能』也是不符合预期的。

正如 TC39 总结道：

> 在 `[[Set]]` 和 `[[Define]]` 之间的选择是在比较了不同的行为预期后的设计决策：第一种预期是不管父类包含的内容，字段总是应该被创建成类的属性，而第二种预期是父类的 `setter` 应该被调用。经过长时间的讨论，TC39 发现保留第一种预期更重要因此决定使用 `[[Define]]` 语义。

作为替代，TC39 决定在仍处于 stage 2 阶段且『命途多舛』的 [decorators 提案](https://link.zhihu.com/?target=https%3A//github.com/tc39/proposal-decorators/)中提供一个显式使用 `[[Set]]` 语义的装饰器。

这在我个人看来无疑是可笑的：

1. 首先装饰器提案已经改了又改，不知何时才能定稿，一个 stage 3 的提案依赖另一个 stage 2 的提案不合常规
2. 长期以来 Babel/TS 的实现都是 `[[Set]]` 语义，虽然 `[[Define]]` 语义有它实际的价值，但显然从当前的迁移成本来看保留 `[[Set]]` 作为默认语义更合理
3. `[[Define]]` 语义的实际作用是总是创建类的属性，如果依赖装饰器提案，默认 `[[Set]]` 显式添加类似 `@define` 装饰器来使用 `[[Define]]` 语义影响面更小

TC39 的结论可能见仁见智，无法让所有人满意，但 Chrome 已经在版本 72 中发布了基于 `[[Define]]` 语义的实现，而这个决定几乎不可能被重新考虑了。
