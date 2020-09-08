// @flow
import type { ValidateResponse } from './types';
const Validator = require('validatorjs');
Validator.useLang('zh');

/**
 * Description 自定义校验规则，！本部分是使用了 validatorjs 作为内部实现
 * @param data
 * @param rules
 * @param customMessage
 * @return ValidateResponse
 */
export function validate(
  data: any,
  rules: {
    [string]: string | []
  },
  customMessage: {
    [string]: string
  } = undefined
): ValidateResponse {
  let isPass = true;
  let errorCount = 0;
  let errors = {};

  let validation = new Validator(data, rules);

  // 调用 passes 执行计算
  isPass = validation.passes();

  // 计算错误数目
  errorCount = validation.errorCount;

  // 重构错误结果
  for (let property of Object.keys(validation.errors.errors)) {
    // 重新定义错误依赖
    errors[property] = {
      rule: rules[property],
      message: validation.errors.errors[property]
    };
  }

  return {
    isPass,
    errorCount,
    errors
  };
}
