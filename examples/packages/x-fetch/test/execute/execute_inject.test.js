// flow

import { executeAndInject } from "../../src/index";
const expectChai = require("chai").expect;

describe("Node 环境下插入测试", () => {
  test("正常返回文本", async () => {
    let texts = await executeAndInject([
      "https://cdn.jsdelivr.net/fontawesome/4.7.0/css/font-awesome.min.css"
    ]);

    // 判断文本长度
    expectChai(texts).to.have.length(1);
  });
});
