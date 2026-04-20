# TypeScript Mixins

Mixin 是一些特殊的类，它们包含了一些可以被其他类使用的方法组合。Mixins 促进了代码的可重用性，并帮助你避免与多继承相关的限制。尽管属性和实例化参数是在编译时定义的，但 Mixins 可以将方法的定义和绑定推迟到运行时。

# 创建 Mixins

为了创建一个 Mixins，我们将利用 TypeScript 的两个方面：接口类扩展和声明合并。不出所料，接口类扩展被用来扩展 TypeScript 中的多个类。声明合并是指 TypeScript 将两个或多个同名的声明合并在一起的过程。接口也可以合并到类和其他结构体中，如果它们有相同的名字。

下面是一个声明合并的例子：

```js
interface Car {
  steering: number;
  tyre: number;
}
interface Car {
  exhaustOutlet: number;
}
// contains properties from both Car interfaces
const BMW: Car = {
  steering: 1,
  tyre: 4,
  exhaustOutlet: 2,
};
```

现在我们了解了这两个 TypeScript 特性，我们就可以开始了。首先，我们需要创建一个基类，然后将 Mixins 应用到基类中。

```js
class Block {
  name = "";
  length = 0;
  breadth = 0;
  height = 0;
  constructor(name: string, length: number, breadth: number, height: number) {
    this.name = name;
    this.length = length;
    this.breadth = breadth;
    this.height = height;
  }
}
```

接下来，创建基类所要扩展的类。

```js
class Moulder {
  moulding = true;
  done = false;
  mould() {
    this.moulding = false;
    this.done = true;
  }
}

class Stacker {
  stacking = true;
  done = false;
  stack() {
    this.stacking = false;
    this.done = true;
  }
}
```

创建一个接口，合并与你的基类（Block）同名的预期类。

```js
interface Block extends Moulder, Stacker {}
```

这个新接口的定义与我们之前创建的 Block 类的名称完全相同。这一点至关重要，因为这个接口同时扩展了 Moulder 和 Stacker 类。这意味着接口将把它们的方法定义合并到一个结构中（接口），同时合并到同名的类定义中。由于声明的合并，Block 类将与 Block 接口合并。

# 创建函数

要创建一个函数来连接两个或多个类声明，我们将使用 TypeScript 官方手册中提供的函数。

```js
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
          Object.create(null)
      );
    });
  });
}
```

前面的函数迭代了 Moulder 和 Stacker 类，然后迭代了它的属性列表，并将这些属性定义到 Block 类中。从本质上讲，我们是在手动地将 Moulder 和 Stacker 类的所有方法和属性链接到 Block 类中。要继续，请按以下方式执行前面的函数，然后查看下面的例子。

```js
applyMixins(Block, [Moulder, Stacker]);
```

# TypeScript Mixin example

```js
let cube = new Block("cube", 4, 4, 4);
cube.mould();
cube.stack();
console.log(
  cube.length,
  cube.breadth,
  cube.height,
  cube.name,
  cube.moulding,
  cube.stacking
);
```

在这里，我们将 cube 分配给基类 Block 的实例。现在，Block 实例可以直接访问分别来自 Moulder 和 Stacker 类的 mould() 和 stack() 方法。

虽然有其他方法来创建 TypeScript 混合器，但这是最优化的模式，因为它更少地依赖编译器，而更多地依赖你的代码库来确保运行时和类型系统保持同步。

# 常用案例

让我们来看看你可能会遇到的或想要考虑的 TypeScript 混杂元素的一些使用情况。

## Handling multiple class extension

TypeScript 的类不能同时扩展几个类，除非在接口中引入一个 mixin。

```js
class Moulder {
  moulding = true;
  done = false
  mould() {
    this.moulding = false;
    this.done = true;
  }
}

class Stacker {
  stacking = true;
  done = false
  stack() {
    this.stacking = false;
    this.done = true;
  }
}

class Block extends Moulder, Stacker{
 constructor() {
    super()
 }
}
```

在这个例子中，Block 类试图同时扩展两个类而没有引入 mixins 的概念。如果你把这个片段添加到在线编辑器（playcode.io）中，你会得到以下错误。
