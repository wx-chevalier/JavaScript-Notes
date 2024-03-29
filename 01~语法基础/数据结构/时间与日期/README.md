# JavaScript 时间与日期类型

## 标准时间

GMT 即格林威治标准时间( Greenwich Mean Time，简称 G.M.T. )，指位于英国伦敦郊区的皇家格林威治天文台的标准时间，因为本初子午线被定义为通过那里的经线。然而由于地球的不规则自转，导致 GMT 时间有误差，因此目前已不被当作标准时间使用。UTC 是最主要的世界时间标准，是经过平均太阳时 ( 以格林威治时间 GMT 为准 )、地轴运动修正后的新时标以及以秒为单位的国际原子时所综合精算而成的时间。UTC 比 GMT 来得更加精准。其误差值必须保持在 0.9 秒以内，若大于 0.9 秒则由位于巴黎的国际地球自转事务中央局发布闰秒，使 UTC 与地球自转周期一致。不过日常使用中，GMT 与 UTC 的功能与精确度是没有差别的。协调世界时区会使用 “Z” 来表示。而在航空上，所有使用的时间划一规定是协调世界时。而且 Z 在无线电中应读作 “Zulu”(可参见北约音标字母)，协调世界时也会被称为 “Zulu time”。

### TimeZone&UTC Offsets | 时区与偏移

人们经常会把时区与 UTC 偏移量搞混，UTC 偏移量代表了某个具体的时间值与 UTC 时间之间的差异，通常用 HH:mm 形式表述。而 TimeZone 则表示某个地理区域，某个 TimeZone 中往往会包含多个偏移量，而多个时区可能在一年的某些时间有相同的偏移量。譬如 America/Chicago, America/Denver, 以及 America/Belize 在一年中不同的时间都会包含 -06:00 这个偏移。

### 时间戳

Unix 时间戳表示当前时间到 1970 年 1 月 1 日 00:00:00 UTC 对应的秒数。注意，JavaScript 内的时间戳指的是当前时间到 1970 年 1 月 1 日 00:00:00 UTC 对应的毫秒数，和 Unix 时间戳不是一个概念，后者表示秒数，差了 1000 倍。

## 时间数字字符串格式

### RFC2822

```
YYYY/MM/DD HH:MM:SS ± timezone(时区用4位数字表示)
// eg 1992/02/12 12:23:22+0800
```

### ISO 8601

国际标准化组织的国际标准 ISO 8601 是日期和时间的表示方法，全称为《数据存储和交换形式 · 信息交换 · 日期和时间的表示方法》。目前最新为第三版 ISO8601:2004，第一版为 ISO8601:1988，第二版为 ISO8601:2000。年由 4 位数组成，以公历公元 1 年为 0001 年，以公元前 1 年为 0000 年，公元前 2 年为 -0001 年，其他以此类推。应用其他纪年法要换算成公历，但如果发送和接受信息的双方有共同一致同意的其他纪年法，可以自行应用。

```
YYYY-MM-DDThh:mm:ss ± timezone(时区用HH:MM表示)
1997-07-16T08:20:30Z
// “Z”表示UTC标准时区，即"00:00",所以这里表示零时区的`1997年7月16日08时20分30秒`
//转换成位于东八区的北京时间则为`1997年7月17日16时20分30秒`
1997-07-16T19:20:30+01:00
// 表示东一区的1997年7月16日19时20秒30分，转换成UTC标准时间的话是1997-07-16T18:20:30Z
```
