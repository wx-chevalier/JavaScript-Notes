# Subject

RxJS Subject 是一种特殊类型的 Observable，它允许将值多播给多个观察者，所以 Subject 是多播的，而普通的 Observables 是单播的(每个已订阅的观察者都拥有 Observable 的独立执行)。Subject 像是 Observable，但是可以多播给多个观察者。Subject 还像是 EventEmitters，维护着多个监听器的注册表。对于 Subject，你可以提供一个观察者并使用 subscribe 方法，就可以开始正常接收值。从观察者的角度而言，它无法判断 Observable 执行是来自普通的 Observable 还是 Subject 。在 Subject 的内部，subscribe 不会调用发送值的新执行。它只是将给定的观察者注册到观察者列表中，类似于其他库或语言中的 addListener 的工作方式。

Subject 是一个有如下方法的对象： next(v)、error(e) 和 complete() 。要给 Subject 提供新值，只要调用 next(theValue)，它会将值多播给已注册监听该 Subject 的观察者们。在下面的示例中，我们为 Subject 添加了两个观察者，然后给 Subject 提供一些值：

```ts
const subject = new Rx.Subject();

subject.subscribe({
  next: v => console.log("observerA: " + v)
});
subject.subscribe({
  next: v => console.log("observerB: " + v)
});

subject.next(1);
subject.next(2);

observerA: 1;
observerB: 1;
observerA: 2;
observerB: 2;
```

## Observable vs Subject

The subject is another Observable type in RxJS. Subjects like Observables can emit multiple event values. However, Subjects allow subscribers of the Subject to push back or trigger their own events on the Subject. Here is what the Subject API looks like,

```ts
import { Observable } from "rxjs";

const observable = new Observable(observer => {
  setTimeout(() => observer.next("hello from Observable!"), 1000);
});

observable.subscribe(v => console.log(v));

import { Subject } from "rxjs";

const subject = new Subject();

subject.next("missed message from Subject");

subject.subscribe(v => console.log(v));

subject.next("hello from subject!");
```

We instantiate the Subject class. With the Subject instance, we can immediately trigger events outside of the constructor by calling next(). Now anyone can listen or trigger events on the Subject. Notice how we call next and emit ‘missed message from Subject’ before we have subscribed to the Subject? Subjects, unlike regular Observables, are what we would call “Hot”. A hot Observable is an Observable that can start emitting events before you subscribe. This means you can miss previous events that have already emitted.

Subjects, unlike Observables, share their work with all subscribers. Unlike our first Observable that created a setTimeout for each subscriber, this Subject would share that work with all subscribers. What if we subscribe late to our Subject and want to get the previous value we missed? Well, that’s where our next Subject type comes in, the ReplaySubject.

```js
const clock$ = Observable.interval(1000).take(3);

const observerA = {
  next(v) {
    console.log(‘A next: ‘ + v)
  }
}
const observerB = {
  next(v) {
    console.log(‘B next: ‘ + v)
  }
}

clock$.subscribe(observerA) // a Observable execution

setTimeout(() => {
  clock$.subscribe(observerB) // another new Observable execution
}, 2000)

/*
 * A next: 0
 * A next: 1
 * A next: 2
 * B next: 0
 * B next: 1
 * B next: 2
 */

// 如果是同一个 shared Observable execution 的话，B的第一个 emit 的值应该是 2 而不是 0 ，并且只有且仅有一个值 2
const clock$ = Observable.interval(1000).take(3);

const observerA = {
  next(v) {
    console.log(‘A next: ‘ + v)
  }
}
const observerB = {
  next(v) {
    console.log(‘B next: ‘ + v)
  }
}
const subject = new Subject()
subject.subscribe(observerA)

clock$.subscribe(subject)

setTimeout(() => {
  subject.subscribe(observerB)
}, 2000)

/*
 * A next: 0
 * A next: 1
 * A next: 2
 * B next: 2
 */
```

# multicast

```js
// RxJS v6+
import { Subject, interval } from "rxjs";
import { take, tap, multicast, mapTo } from "rxjs/operators";

//emit every 2 seconds, take 5
const source = interval(2000).pipe(take(5));

const example = source.pipe(
  //since we are multicasting below, side effects will be executed once
  tap(() => console.log("Side Effect #1")),
  mapTo("Result!")
);

//subscribe subject to source upon connect()
const multi = example.pipe(multicast(() => new Subject()));
/*
  subscribers will share source
  output:
  "Side Effect #1"
  "Result!"
  "Result!"
  ...
*/
const subscriberOne = multi.subscribe(val => console.log(val));
const subscriberTwo = multi.subscribe(val => console.log(val));
//subscribe subject to source
multi.connect();
```

# 引用计数

通常，当第一个观察者到达时我们想要自动地连接，而当最后一个观察者取消订阅时我们想要自动地取消共享执行。我们可以使用 ConnectableObservable 的 refCount() 方法(引用计数)，这个方法返回 Observable，这个 Observable 会追踪有多少个订阅者。当订阅者的数量从 0 变成 1，它会调用 connect() 以开启共享的执行。当订阅者数量从 1 变成 0 时，它会完全取消订阅，停止进一步的执行。

refCount 的作用是，当有第一个订阅者时，多播 Observable 会自动地启动执行，而当最后一个订阅者离开时，多播 Observable 会自动地停止执行。

```js
const source = Rx.Observable.interval(500);
const subject = new Rx.Subject();
const refCounted = source.multicast(subject).refCount();
const subscription1, subscription2, subscriptionConnect;

// 这里其实调用了 `connect()`，
// 因为 `refCounted` 有了第一个订阅者
console.log("observerA subscribed");
subscription1 = refCounted.subscribe({
  next: v => console.log("observerA: " + v)
});

setTimeout(() => {
  console.log("observerB subscribed");
  subscription2 = refCounted.subscribe({
    next: v => console.log("observerB: " + v)
  });
}, 600);

setTimeout(() => {
  console.log("observerA unsubscribed");
  subscription1.unsubscribe();
}, 1200);

// 这里共享的 Observable 执行会停止，
// 因为此后 `refCounted` 将不再有订阅者
setTimeout(() => {
  console.log("observerB unsubscribed");
  subscription2.unsubscribe();
}, 2000);

setTimeout(() => {
  console.log("observerC subscribed");
  subscription2 = refCounted.subscribe({
    next: v => console.log("observerC: " + v)
  });
}, 2500);

/*
"observerA subscribed"
"observerA: 0"
"observerB subscribed"
"observerA: 1"
"observerB: 1"
"observerA unsubscribed"
"observerB: 2"
"observerB: 3"
"observerB unsubscribed"
"observerC subscribed"
"observerC: 0"
*/
```

refCount() 只存在于 ConnectableObservable，它返回的是 Observable，而不是另一个 ConnectableObservable 。

# BehaviorSubject

Subject 的其中一个变体就是 BehaviorSubject，它有一个“当前值”的概念。它保存了发送给消费者的最新值。并且当有新的观察者订阅时，会立即从 BehaviorSubject 那接收到“当前值”。BehaviorSubjects 适合用来表示“随时间推移的值”。举例来说，生日的流是一个 Subject，但年龄的流应该是一个 BehaviorSubject 。

在下面的示例中，BehaviorSubject 使用值 0 进行初始化，当第一个观察者订阅时会得到 0。第二个观察者订阅时会得到值 2，尽管它是在值 2 发送之后订阅的。

```js
const subject = new Rx.BehaviorSubject(0); // 0是初始值

subject.subscribe({
  next: v => console.log("observerA: " + v)
});

subject.next(1);
subject.next(2);

subject.subscribe({
  next: v => console.log("observerB: " + v)
});

subject.next(3);

/**
observerA: 0
observerA: 1
observerA: 2
observerB: 2
observerA: 3
observerB: 3
**/
```

# ReplaySubject

ReplaySubject 类似于 BehaviorSubject，它可以发送旧值给新的订阅者，但它还可以记录 Observable 执行的一部分。ReplaySubject 记录 Observable 执行中的多个值并将其回放给新的订阅者。当创建 ReplaySubject 时，你可以指定回放多少个值：

```js
const subject = new Rx.ReplaySubject(3); // 为新的订阅者缓冲3个值

subject.subscribe({
  next: v => console.log("observerA: " + v)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
  next: v => console.log("observerB: " + v)
});

subject.next(5);

/**
observerA: 1
observerA: 2
observerA: 3
observerA: 4
observerB: 2
observerB: 3
observerB: 4
observerA: 5
observerB: 5
**/
```

除了缓冲数量，你还可以指定 window time (以毫秒为单位)来确定多久之前的值可以记录。在下面的示例中，我们使用了较大的缓存数量 100，但 window time 参数只设置了 500 毫秒。

```js
const subject = new Rx.ReplaySubject(100, 500 /* windowTime */);

subject.subscribe({
  next: v => console.log("observerA: " + v)
});

const i = 1;
setInterval(() => subject.next(i++), 200);

setTimeout(() => {
  subject.subscribe({
    next: v => console.log("observerB: " + v)
  });
}, 1000);
```

从下面的输出可以看出，第二个观察者得到的值是`3`、`4`、`5`，这三个值是订阅发生前的`500`毫秒内发生的：

```none
observerA: 1
observerA: 2
observerA: 3
observerA: 4
observerA: 5
observerB: 3
observerB: 4
observerB: 5
observerA: 6
observerB: 6
...
```

# AsyncSubject

AsyncSubject 是另一个 Subject 变体，只有当 Observable 执行完成时(执行 `complete()`)，它才会将执行的最后一个值发送给观察者。

```js
const subject = new Rx.AsyncSubject();

subject.subscribe({
  next: v => console.log("observerA: " + v)
});

subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);

subject.subscribe({
  next: v => console.log("observerB: " + v)
});

subject.next(5);
subject.complete();
```

输出：

```none
observerA: 5
observerB: 5
```

AsyncSubject 和 [`last()`](https://cn.rx.js.org/class/es6/Observable.js~Observable.html#instance-method-last) 操作符类似，因为它也是等待 `complete` 通知，以发送一个单个值。
