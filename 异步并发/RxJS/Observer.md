# Observer

观察者是由 Observable 发送的值的消费者。观察者只是一组回调函数的集合，每个回调函数对应一种 Observable 发送的通知类型：next、error 和 complete 。下面的示例是一个典型的观察者对象：

```js
const observer = {
  next: x => console.log("Observer got a next value: " + x),
  error: err => console.error("Observer got an error: " + err),
  complete: () => console.log("Observer got a complete notification")
};
```

要使用观察者，需要把它提供给 Observable 的 subscribe 方法：

```js
observable.subscribe(observer);
```

RxJS 中的观察者也可能是*部分的*。如果你没有提供某个回调函数，Observable 的执行也会正常运行，只是某些通知类型会被忽略，因为观察者中没有相对应的回调函数。

下面的示例是没有 `complete` 回调函数的观察者：

```js
const observer = {
  next: x => console.log("Observer got a next value: " + x),
  error: err => console.error("Observer got an error: " + err)
};
```

当订阅 Observable 时，你可能只提供了一个回调函数作为参数，而并没有将其附加到观察者对象上，例如这样：

```js
observable.subscribe(x => console.log("Observer got a next value: " + x));
```

在 `observable.subscribe` 内部，它会创建一个观察者对象并使用第一个回调函数参数作为 `next` 的处理方法。三种类型的回调函数都可以直接作为参数来提供：

```js
observable.subscribe(
  x => console.log("Observer got a next value: " + x),
  err => console.error("Observer got an error: " + err),
  () => console.log("Observer got a complete notification")
);
```

# Subscription

Subscription 是表示可清理资源的对象，通常是 Observable 的执行。Subscription 有一个重要的方法，即 unsubscribe，它不需要任何参数，只是用来清理由 Subscription 占用的资源。在上一个版本的 RxJS 中，Subscription 叫做 "Disposable" (可清理对象)。

```js
const observable = Rx.Observable.interval(1000);
const subscription = observable.subscribe(x => console.log(x));
// 稍后：
// 这会取消正在进行中的 Observable 执行
// Observable 执行是通过使用观察者调用 subscribe 方法启动的
subscription.unsubscribe();
```

Subscription 基本上只有一个 unsubscribe() 函数，这个函数用来释放资源或去取消 Observable 执行。Subscription 还可以合在一起，这样一个 Subscription 调用 unsubscribe() 方法，可能会有多个 Subscription 取消订阅 。你可以通过把一个 Subscription 添加到另一个上面来做这件事：

```js
const observable1 = Rx.Observable.interval(400);
const observable2 = Rx.Observable.interval(300);

const subscription = observable1.subscribe(x => console.log("first: " + x));
const childSubscription = observable2.subscribe(x =>
  console.log("second: " + x)
);

subscription.add(childSubscription);

setTimeout(() => {
  // subscription 和 childSubscription 都会取消订阅
  subscription.unsubscribe();
}, 1000);
```
