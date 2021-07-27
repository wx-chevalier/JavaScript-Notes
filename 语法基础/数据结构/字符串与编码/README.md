# JavaScript 字符串

# Manipulation: 操作

## 创建添加

## Format/Template: 格式化与模板字符串生成

## 替换删除

## 创建增删

### 插值 ES6 中开始支持较为复杂的模板字符串方式：

```javascript
// Basic literal string creation `In JavaScript '\n' is a line-feed.`

// Multiline strings `In JavaScript this is not legal.`

// String interpolation const name = "Bob", time = "today"; `Hello ${name}, how are you ${time}?`

// Construct an HTTP request prefix is used to interpret the replacements and construction GET`http://foo.org/bar?a=${a}&b=${b} Content-Type: application/json X-Credentials: ${credentials} { "foo": ${foo}, "bar": ${bar}}`(myOnReadyStateChangeHandler);
```

### 替换删除如果是仅替换一次，可以直接使用 String.prototype.replace，如果需要全部替换：

```js
str = str.replace(/abc/g, "");
function replaceAll(str, find, replace) {
  return str.replace(new RegExp(find, "g"), replace);
}
```
