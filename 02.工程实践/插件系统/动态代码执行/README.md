# JavaScript 动态代码执行

我们写的 JS 代码，主要执行在浏览器环境和 node 环境，也叫宿主环境。宿主环境通过加载机制获取到我们的代码，然后使用 JS 引擎解释执行。这是正常的 JS 代码执行流程。有些场景下，js 代码是通过程序动态生成的，此时我们已经运行在 JS 引擎内部，没有宿主环境帮我们执行代码，就需要 JS 引擎提供的动态执行代码的能力。

动态执行代码普遍存在两个缺点，一是安全性问题，传递的函数体字符串如果包含非法代码也会被执行。二是执行性能，动态执行时会解析代码，存在一定的时间消耗。eval 还会影响到 js 引擎的优化过程，导致效率降低非常多。eval is evil 说的就是使用 eval 可能导致很严重的问题。从上面几种方法可以看到，理解 js 动态执行代码时的作用域是关键。一是是否存在自己的作用域，二是其父作用域是当前作用域还是全局作用域。只要记住这两个问题的答案，在使用时就不会出现大问题。

# new Function

Function 构造函数创建一个函数对象，这个函数对象和使用函数声明和函数表达式创建的一样，区别是函数的解析时机不同。Function 构造函数是在执行时解析，后者是在脚本加载时解析。Function 创建的函数有自己的作用域，其父作用域是全局作用域，只能访问全局变量和自己的局部变量，不能访问函数被创建时所在的作用域。需要注意在 node 环境和 esm 环境存在模块作用域，模块作用域不是全局作用域。Function 创建的函数也不能访问模块作用域。

```js
var a = -100;

(function () {
  var a = 1;

  // 函数执行时的父作用域时全局作用域
  new Function("console.log(a)")(); // -100

  // 内部的 this 是 window
  var nfunc = new Function("return this");
  console.log(nfunc()); // Window

  // 作为对象的方法时， this 是当前对象
  var obj = { nfunc: nfunc };
  console.log(obj.nfunc()); // {nfunc: ƒ}
})();
```

# eval

eval 没有自己的作用域，而是使用执行时所在的作用域，在 eval 中初始化语会将变量加入到当前作用域。由于变量是在运行时动态添加的，导致 v8 引擎不能做出正确的判断，只能放弃优化策略。在严格模式下，eval 有自己的作用域，这样就不会污染当前作用域。

```js
(function () {
  // eval 没有自己的作用域，使用当前作用域。
  var a = 100;
  eval("console.log(a)"); // 100

  // 初始化语句会添加变量到当前作用域上，也就是会污染当前作用域。这是 v8 引擎没法优化这段代码的原因，也是性能差的原因。
  eval("var b = 20");
  console.log(b); // 20
})();

(function () {
  "use strict";

  // 严格模式下，eval 有自己的作用域，父作用域是当前作用域。
  var a = 100;
  eval("console.log(a)"); // 100 当前作用域上的 a

  // 严格模式下，eval 有自己的作用域，初始化语句将变量添加到自己的作用域内。执行完后当前作用域被销毁
  eval("var b = 20");
  console.log(b); // 1 全局作用域上的 b

  // 返回 eval 代码段产生的闭包
  var innerb = eval("var b = 20; (function () { return b })")();
  console.log("innerb", innerb); // innerb 20
})();
```

值得注意的是，eval 如果不使用 direct call 的方式调用，其使用的作用域将会变为全局作用域。

```js
var a = 0;

(function () {
  var a = 100;
  var fn = eval;

  // 非 direct call 的调用方式
  fn("console.log(a)"); // 0
})();
```

# setTimeout

setTimeout 用来设置定时器，其第一个参数可以传入函数，也可以传入代码片段。传入函数时，函数的作用域是正常的函数作用域。传入代码片段时，没有自己的作用域，其执行时作用域是全局作用域。

```js
var a = -100;

(function () {
  var a = 0;

  // setTimeout 执行的代码段，没有自己的作用域，运行在全局作用域中
  var dynameicCode = "console.log(a)";
  setTimeout(dynameicCode, 10); // -100

  // setTimeout 执行的代码段，初始化语句会添加变量到 window 上
  var dynameicCode = "var b = 200;";
  setTimeout(dynameicCode, 10);
  setTimeout(function () {
    console.log("window.b", window.b); // window.b 200
  }, 20);
})();
```

# script.textContent

动态创建 script 节点，也是一种动态执行语句的方式。其创建的 script 和普通 script 没有区别，代码的作用域是全局作用域。需要注意 script 应该使用 document.createElement('script') 创建并插入到文档中。使用 innerHTML 插入 script 的方式，脚本不会执行。

```js
(function () {
  var a = 1;
  var s = document.createElement("script");

  s.textContent = "console.log(a)";
  document.documentElement.append(s);
})();
```

# onclick="xxx"

html 元素的 onclick 属性也支持设置 js 代码，这种特性被称为 Inline event handlers。这种方式执行的代码存在自己的作用域，父作用域是全局作用域。也就是说初始化语句不会污染全局作用域。

```html
<script>
  var a = -100;
  var b = 2;
</script>

<!-- 点击按钮输出 -100 200 -->
<button onclick="var b = 200; console.log(a, b);">click me</button>
<!-- 执行成功后，在控制台检查，全局作用域内并没有变量 b -->
```
