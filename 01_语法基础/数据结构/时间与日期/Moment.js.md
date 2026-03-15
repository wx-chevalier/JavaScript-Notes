# [Moment.js](http://momentjs.com/guides/)

Moment.js 为 JavaScript Date 对象提供了封装与统一好的 API 接口，并且提供了更多的功能。首先需要了解的是，Moment 提供的 moment 对象是可变的，即当我们对该对象执行类似于增减或者设置的时候，其对象本身的值会发生变化，譬如下面这段代码

```js
const a = moment("2016-01-01");
const b = a.add(1, "week");
a.format();
("2016-01-08T00:00:00-06:00");
```

而如果我们不希望改变原有的值，特别是在需要创建多个时间日期对象的时候，我们可以利用 clone 方法

```js
const a = moment("2016-01-01");
const b = a.clone().add(1, "week");
a.format();
("2016-01-01T00:00:00-06:00");
```

笔者是习惯在 Webpack 中进行打包，类似于 Node 下的安装方式

```js
// 安装
npm install moment

// 使用
const moment = require('moment');
moment().format();
```

如果你需要引入某个语言包，那么可以用如下方式

```
const moment = require('moment');
require('moment/locale/cs');
console.log(moment.locale()); // cs
```

## Parse

### TimeStamp

```
//毫秒
const day = moment(1318781876406);
//秒
const day = moment.unix(1318781876);
```

### DateTimeString

```
moment("2010-10-20 4:30",       "YYYY-MM-DD HH:mm");   // parsed as 4:30 local time
moment("2010-10-20 4:30 +0000", "YYYY-MM-DD HH:mm Z"); // parsed as 4:30 UTC

moment("2010 13",           "YYYY MM").isValid();     // false (not a real month)
moment("2010 11 31",        "YYYY MM DD").isValid();  // false (not a real day)
moment("2010 2 29",         "YYYY MM DD").isValid();  // false (not a leap year)
moment("2010 notamonth 29", "YYYY MMM DD").isValid(); // false (not a real month name)
```

## Manipulate

### Get/Set

```
moment().seconds(30) === new Date().setSeconds(30);
moment().seconds()   === new Date().getSeconds();

moment().get('year');
moment().get('month');  // 0 to 11
moment().get('date');
moment().get('hour');
moment().get('minute');
moment().get('second');
moment().get('millisecond');
```

```
moment().set('year', 2013);
moment().set('month', 3);  // April
moment().set('date', 1);
moment().set('hour', 13);
moment().set('minute', 20);
moment().set('second', 30);
moment().set('millisecond', 123);

moment().set({'year': 2013, 'month': 3});
```

### Add&Subtract

```
moment().add(Number, String);
moment().add(Duration);
moment().add(Object);

moment().add(7, 'days');

moment().subtract(Number, String);
moment().subtract(Duration);
moment().subtract(Object);

moment().subtract(7, 'days');
```

### Comparison

```
moment().isBefore(Moment|String|Number|Date|Array);
moment().isBefore(Moment|String|Number|Date|Array, String);

moment('2010-10-20').isBefore('2010-12-31', 'year'); // false
moment('2010-10-20').isBefore('2011-01-01', 'year'); // true
```

### Diff

```
moment().diff(Moment|String|Number|Date|Array);
moment().diff(Moment|String|Number|Date|Array, String);
moment().diff(Moment|String|Number|Date|Array, String, Boolean);

const a = moment([2007, 0, 29]);
const b = moment([2007, 0, 28]);
a.diff(b, 'days') // 1
```

## Display

### Format

```js
moment().format(); // "2014-09-08T08:02:17-05:00" (ISO 8601)
moment().format("dddd, MMMM Do YYYY, h:mm:ss a"); // "Sunday, February 14th 2010, 3:25:50 pm"
moment().format("ddd, hA"); // "Sun, 3PM"
moment("gibberish").format("YYYY MM DD"); // "Invalid date"
```

### Relative Format

```
moment([2007, 0, 29]).fromNow();     // 4 years ago
moment([2007, 0, 29]).fromNow(true); // 4 years
```

### Duration

```
moment.duration(1, "minutes").humanize(); // a minute
moment.duration(2, "minutes").humanize(); // 2 minutes
moment.duration(24, "hours").humanize();  // a day
```

## i18n
