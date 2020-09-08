// @flow

export type ValidateResponse = {
  // 是否校验通过
  isPass: boolean,

  // 错误统计
  errorCount: number,

  // 错误对象
  errors: {
    // 属性名
    [string]: {
      // 违反的规则
      rule: string,
      // 错误提示
      message: string
    }
  }
};
