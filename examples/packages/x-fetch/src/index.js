import _RequestBuilder from "./request/RequestBuilder";
import _executePolyfill from "./execute/execute.polyfill";
import _executeAndInject from "./execute/execute_inject";

export const RequestBuilder = _RequestBuilder;

// 注意，这里交换了 Polyfill 的顺序，是为了默认设置进行 Polyfill
export const execute = _executePolyfill;
export const executeAndInject = _executeAndInject;
