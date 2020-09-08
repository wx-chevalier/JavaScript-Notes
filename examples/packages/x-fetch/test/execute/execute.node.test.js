const expectChai = require("chai").expect;
import { execute } from "../../src/index.js";
import { RequestBuilder } from "../../src/index.js";

const requestBuilder = new RequestBuilder({
  scheme: "https",
  host: "jsonplaceholder.typicode.com"
});

describe("Pipe 测试", () => {
  test("测试图片下载", async () => {
    let promise = execute(
      "https://assets-cdn.github.com/images/modules/logos_page/Octocat.png",
      {},
      "blob"
    ).pipe("/tmp/Octocat.png", require("fs"));
  });
});
