# Date

JavaScript 为我们提供了不是很好用的 Date 对象作为时间日期对象，Date() 直接返回当前时间字符串，不管参数是 number 还是任何 string。而 new Date() 则是会根据参数来返回对应的值，无参数的时候，返回当前时间的字符串形式；有参数的时候返回参数所对应时间的字符串。new Date() 对参数不管是格式还是内容都要求, 且只返回字符串, 标准的构造 Date 对象的方法有

```
// 不带new操作符，像一个函数一样调用。它将忽略所有传入的参数，并返回当前日期和时间的一个字符串表示。
new Date();
// 可接受一个数字参数，该参数表示设定时间与1970年1月1日0点之间的毫秒数。
new Date(value);
// 可接受一个字符串参数，参数形式类似于Date.parse()方法。但parse()方法返回的是一个数字，而Date()函数返回的是一个对象。
new Date(dateString);
// 可接受参数形式类似于Date.UTC()方法的参数，但Date.UTC()方法返回是一个毫秒数，且是UTC时间，而Date()函数返回是一个对象，且是本地时间。
new Date(year, month[, day[, hour[, minutes[, seconds[, milliseconds]]]]]);
---------------------------------------------------------------------------------------------------------------------
year：四位年份，如果写成两位数，则加上1900
month：表示月份，0表示一月，11表示12月
date：表示日期，1到31
hour：表示小时，0到23
minute：表示分钟，0到59
second：表示秒钟，0到59
ms：表示毫秒，0到999
```

这里需要注意的是，**月份 month 参数，其计数方式从 0 开始，而天 day 参数，其计数方式从 1 开始**。

```js
new Date();
//Fri Aug 21 2015 15:51:55 GMT+0800 (中国标准时间)
new Date(1293879600000);
new Date("2011-01-01T11:00:00");
new Date("2011/01/01 11:00:00");
new Date(2011, 0, 1, 11, 0, 0);
new Date("jan 01 2011,11 11:00:00");
new Date("Sat Jan 01 2011 11:00:00");
//Sat Jan 01 2011 11:00:00 GMT+0800 (中国标准时间)
new Date("sss");
new Date("2011/01/01T11:00:00");
new Date("2011-01-01-11:00:00");
new Date("1293879600000");
//Invalid Date
new Date("2011-01-01T11:00:00") - new Date("1992/02/11 12:00:12");
//596069988000
```

## Parse | 解析

### TimeStamp | 时间戳

如果需要从当前的时间对象获取其相应的时间戳，我们可以使用 getTime 或者 valueOf()，返回距离 1970 年 1 月 1 日 0 点的毫秒数

```js
const date1 = new Date(2007, 0, 1);
const date2 = new Date(2007, 1, 1);

console.log(date1 > date2); //false
console.log(date1 < date2); //true

// ECMAScript5新增了now()方法，该方法返回当前时间距离1970年1月1日0点UTC的毫秒数。该方法不支持传递参数
Date.now = function () {
  return new Date().getTime();
};
```

另外 Date 对象还有一个静态方法同样返回给定日期的毫秒数。但其参数并不是一个字符串，而是分别代表年、月、日、时、分、秒、毫秒的数字参数

```js
console.log(Date.UTC(1970)); //NaN
console.log(Date.UTC(1970, 0)); //0
console.log(Date.UTC(1970, 0, 2)); //86400000
console.log(Date.UTC(1970, 0, 1, 1)); //3600000
console.log(Date.UTC(1970, 0, 1, 1, 59)); //714000
console.log(Date.UTC(1970, 0, 1, 1, 59, 30)); //717000
```

还是需要强调下，JavaScript 内的时间戳指的是当前时间到 1970 年 1 月 1 日 00:00:00 UTC 对应的毫秒数，和 unix 时间戳不是一个概念，后者表示秒数，差了 1000 倍。`new Date(timestamp)`中的时间戳必须是`number`格式，`string`会返回`Invalid Date`。所以比如`new Date('11111111')`这种写法是错的。

### DateTimeString | 时间日期字符串

JavaScript 原生 Date 对于时间字符串的解析真的是槽点满满，假设我们希望以 DD/MM/YYYY 的格式进行解析，那么它是无法识别的

```js
const a = new Date("01/12/2016"); //December 1 2016 in DD/MM/YYYY format
//"Tue Jan 12 2016 00:00:00 GMT-0600 (Central Standard Time)"
```

另外，在 ES5 的标准中，其对 ISO 8601 标准的字符串进行了一个神奇的断言 : 所有没有提供时区的字符串默认为标准时区。换言之，你会发现你解析出来的时间和你预期中的不一样，而且它打印的时候是按照本地时区又进行了转换

```
//US local format
const a = new Date('1/1/2016');
//"Fri Jan 01 2016 00:00:00 GMT-0600 (Central Standard Time)"

//ISO 8601
const a = new Date('2016-01-01');
//"Thu Dec 31 2015 18:00:00 GMT-0600 (Central Standard Time)"
```

ES 2015 标准中则是修复了该 Bug，不过还是会让人觉得头大，毕竟你不知道你代码的最终运行环境会是 ES5 还是 ES6。Date 对象也有一个 parse 方法，用于解析一个日期字符串，参数是一个包含待解析的日期和时间的字符串，返回从 1970 年 1 月 1 日 0 点到给定日期的毫秒数。该方法会根据日期时间字符串格式规则来解析字符串的格式，除了标准格式外，以下格式也支持。如果字符串无法识别，将返回 NaN。

- ' 月 / 日 / 年 ' 如 6/13/2004
- ' 月 日, 年 ' 如 January 12,2004 或 Jan 12,2004
- ' 星期 月 日 年 时 : 分 : 秒 时区 ' Tue May 25 2004 00:00:00 GMT-0700

```
console.log(Date.parse('6/13/2004'));//1087056000000
console.log(Date.parse('January 12,2004'));//1073836800000
console.log(Date.parse('Tue May 25 2004 00:00:00 GMT-0700'));//1085468400000
console.log(Date.parse('2004-05-25T00:00:00'));//1085443200000
console.log(Date.parse('2016'));//1451606400000
console.log(Date.parse('T00:00:00'));//NaN
console.log(Date.parse());//NaN
```

在 ECMAScript5 中，如果使用标准的日期时间字符串格式规则的字符串中，数学前有前置 0，则会解析为 UTC 时间，时间没有前置 0，则会解析为本地时间。其他情况一般都会解析为本地时间

```
console.log(Date.parse('7/12/2016'));//1468252800000
console.log(Date.parse('2016-7-12'));//1468252800000
console.log(Date.parse('2016-07-12'));//1468281600000
```

## Manipulate | 时间对象操作

### Get & Set | 属性值设置

Date 对象提供了一系列 get\* 方法，用来获取实例对象某个方面的值。具体的 Get 函数列表详见附录

```sjs
const d = new Date("January 6, 2013");

d.getDate(); // 6
d.getMonth(); // 0
d.getYear(); // 113
d.getFullYear(); // 2013
d.getTimezoneOffset(); // -480
```

同样的，Date 对象还提供了一系列的 Set 方法

```js
const d1 = new Date("January 6, 2013");

d1.setDate(32); // 1359648000000
d1; // Fri Feb 01 2013 00:00:00 GMT+0800 (CST)

const d2 = new Date("January 6, 2013");

d.setDate(-1); // 1356796800000
d; // Sun Dec 30 2012 00:00:00 GMT+0800 (CST)
```

### Add & Subtract | 运算操作

我们可以巧用 Set 方法的特性，set\* 方法的参数都会自动折算。以 setDate 为例，如果参数超过当月的最大天数，则向下一个月顺延，如果参数是负数，表示从上个月的最后一天开始减去的天数。

```js
const d1 = new Date("January 6, 2013");

d1.setDate(32); // 1359648000000
d1; // Fri Feb 01 2013 00:00:00 GMT+0800 (CST)

const d2 = new Date("January 6, 2013");

d.setDate(-1); // 1356796800000
d; // Sun Dec 30 2012 00:00:00 GMT+0800 (CST)

const d = new Date();

// 将日期向后推1000天
d.setDate(d.getDate() + 1000);

// 将时间设为6小时后
d.setHours(d.getHours() + 6);

// 将年份设为去年
d.setFullYear(d.getFullYear() - 1);
```

### Diff | 计算差值

类型转换时，Date 对象的实例如果转为数值，则等于对应的毫秒数；如果转为字符串，则等于对应的日期字符串。所以，两个日期对象进行减法运算，返回的就是它们间隔的毫秒数；进行加法运算，返回的就是连接后的两个字符串。

```js
const d1 = new Date(2000, 2, 1);

const d2 = new Date(2000, 3, 1);

d2 - d1;
// 2678400000

d2 + d1;
// "Sat Apr 01 2000 00:00:00 GMT+0800 (CST)Wed Mar 01 2000 00:00:00 GMT+0800 (CST)"
```

## Display | 时间展示

- 年月日

| Input      | Example          | Description                                            |
| ---------- | ---------------- | ------------------------------------------------------ |
| `YYYY`     | `2014`           | 4 or 2 digit year                                      |
| `YY`       | `14`             | 2 digit year                                           |
| `Y`        | `-25`            | Year with any number of digits and sign                |
| `Q`        | `1..4`           | Quarter of year. Sets month to first month in quarter. |
| `M MM`     | `1..12`          | Month number                                           |
| `MMM MMMM` | `Jan..December`  | Month name in locale set by `moment.locale()`          |
| `D DD`     | `1..31`          | Day of month                                           |
| `Do`       | `1st..31st`      | Day of month with ordinal                              |
| `DDD DDDD` | `1..365`         | Day of year                                            |
| `X`        | `1410715640.579` | Unix timestamp                                         |
| `x`        | `1410715640579`  | Unix ms timestamp                                      |

- 时分秒

| Input      | Example  | Description                                                                    |
| ---------- | -------- | ------------------------------------------------------------------------------ |
| `H HH`     | `0..23`  | 24 hour time                                                                   |
| `h hh`     | `1..12`  | 12 hour time used with `a A`.                                                  |
| `a A`      | `am pm`  | Post or ante meridiem (Note the one character `a p` are also considered valid) |
| `m mm`     | `0..59`  | Minutes                                                                        |
| `s ss`     | `0..59`  | Seconds                                                                        |
| `S SS SSS` | `0..999` | Fractional seconds                                                             |
| `Z ZZ`     | `+12:00` | Offset from UTC as `+-HH:mm`, `+-HHmm`, or `Z`                                 |

### Format | 格式化

Date 对象提供了一系列的`to*`方法来支持从 Date 对象转化为字符串，具体的函数列表详见附录

```
const d = new Date(2013, 0, 1);

d.toString()
// "Tue Jan 01 2013 00:00:00 GMT+0800 (CST)"

d.toUTCString()
// "Mon, 31 Dec 2012 16:00:00 GMT"

d.toISOString()
// "2012-12-31T16:00:00.000Z"

d.toJSON()
// "2012-12-31T16:00:00.000Z"

d.toDateString() // "Tue Jan 01 2013"

d.toTimeString() // "00:00:00 GMT+0800 (CST)"

d.toLocaleDateString()
// 中文版浏览器为"2013年1月1日"
// 英文版浏览器为"1/1/2013"

d.toLocaleTimeString()
// 中文版浏览器为"上午12:00:00"
// 英文版浏览器为"12:00:00 AM"
```

### Durations: 时长

```
const nMS = 1320; //以毫秒单位表示的差值时间
const nD = Math.floor(nMS/(1000 * 60 * 60 * 24));
const nH = Math.floor(nMS/(1000*60*60)) % 24;
const nM = Math.floor(nMS/(1000*60)) % 60;
const nS = Math.floor(nMS/1000) % 60;
```

### i18n: 国际化

浏览器获取当前用户所在的时区等信息只和系统的日期和时间设置里的时区以及时间有关。区域和语言设置影响的是浏览器默认时间函数 (Date.prototype.toLocaleString 等 ) 显示的格式，不会对时区等有影响。Date 有个 Date.prototype.toLocaleString() 方法可以将时间字符串返回用户本地字符串格式，这个方法还有两个子方法 Date.prototype.toLocaleDateString 和 Date.prototype.toLocaleTimeString，这两个方法返回值分别表示日期和时间，加一起就是 Date.prototype.toLocaleString 的结果。这个方法的默认参数会对时间字符串做一次转换，将其转换成用户当前所在时区的时间，并按照对应的系统设置时间格式返回字符串结果。然而不同浏览器对用户本地所使用的语言格式的判断依据是不同的。

- IE: 获取系统当前的区域和语言 - 格式中设置的格式，依照其对应的格式来显示当前时间结果 ;IE 浏览器实时查询该系统设置(即你在浏览器窗口打开后去更改系统设置也会引起返回格式变化)。假设系统语言为 ja-JP，系统 unicode 语言为 zh-CN 日期格式为 nl-NL, 浏览器语言设置(accept-language) 为 de, 浏览器界面语言为 en-US(其他条件不变，浏览器界面语言改为 zh-CN 的时候结果也是一样 )，

```
window.navigator.language
//"nl-NL"
window.navigator.systemLanguage
//"zh-CN"(设置中的非unicode程序所使用语言选项)
window.navigator.userLanguage
//"nl-NL"
window.navigator.browserLanguage
//"ja-JP"(系统菜单界面语言)
window.navigator.languages
//undefined
```

- FF：获取方式和结果与 IE 浏览器相同，区别在于 FF 只会在浏览器进程第一次启动的时候获取一次系统设置，中间不管怎么系统设置怎么变化，FF 都无法获取到当前系统设置。除非重启 FF 浏览器。当浏览器界面语言为 zh-CN,accept-language 首位为 en-US 的时候：

```
window.navigator.language
//'en-US'
window.navigator.languages
//["en-US", "zh-CN", "de", "zh", "en"]
//当界面语言改为"en-US",`accept-language`首位为`zh-CN`的时候
window.navigator.language
//'zh-CN'(`accept-language`首选值)
window.navigator.languages
//["zh-CN", "de", "zh", "en-US", "en"]
```

- Chrome: 获取方式和以上两个都不同。chrome 无视系统的区域和语言 - 格式格式，只依照自己浏览器的界面设置的菜单语言来处理。( 比如英文界面则按系统 ’en-US’ 格式返回字符串，中文界面则按系统 ’zh-CN’ 格式返回结果 )。当浏览器界面语言为 zh-CN,accept-language 首位为 en-US 的时候：

```
window.navigator.language
//'zh-CN'
window.navigator.languages
//["en-US", "en", "zh-CN", "zh", "ja", "zh-TW", "de-LI", "de", "pl"]
//当界面语言改为"en-US"时
window.navigator.language
//'en-US'(浏览器界面语言)
```

## Calendar | 日历操作
