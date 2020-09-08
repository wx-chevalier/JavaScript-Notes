// @flow
const debug = require("debug")("validator");

import isEmail from "validator/lib/isEmail";
import { ValidateResponse } from "./types";
const ruleRegex = /^(.+?)\[(.+)\]$/,
  numericRegex = /^[0-9]+$/,
  numericExtractRegex = /[0-9]+/,
  integerRegex = /^\-?[0-9]+$/,
  decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
  mobileRegex = /^1\d{10}$/i,
  emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  alphaRegex = /^[a-z]+$/i,
  alphaNumericRegex = /^[a-z0-9]+$/i,
  alphaDashRegex = /^[a-z0-9_\-]+$/i,
  naturalRegex = /^[0-9]+$/i,
  naturalNoZeroRegex = /^[1-9][0-9]*$/i,
  ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
  base64Regex = /[^a-zA-Z0-9\/\+=]/i,
  numericDashRegex = /^[\d\-\s]+$/,
  urlRegex = /^((http|https):\/\/(\w+:{0,1}\w*@)?(\S+)|)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,
  dateRegex = /\d{4}-\d{1,2}-\d{1,2}/;

/**
 * @function 验证是否为必须选项
 * @param rule
 * @param value
 * @return {boolean}
 * @private
 */
export function _isRequired(rule, value) {
  if (value === 0 || value === "0") {
    return true;
  }

  let isEmpty = value !== 0 || !value || value === "" || value === undefined;

  //如果是必须
  if (rule === "required") {
    if (isEmpty) return false;
  }
  return true;
}
/**
 * @function 验证是否为EMail
 * @param rule
 * @param value
 * @return {boolean}
 * @private
 */
export function _isEmail(rule, value) {
  //判断是否为e-mail
  if (rule === "email") {
    if (!isEmail(value)) return false;
  }
  return true;
}
/**
 * @function 验证是否为固定长度
 * @param rule
 * @param value
 * @return {boolean}
 * @private
 */
export function _isFixedLength(rule, value) {
  //判断长度是否符合条件
  if (rule.indexOf("length") > -1) {
    //如果规则不成立，则直接返回错误提示
    if (!ruleRegex.test(rule)) {
      return false;
    }
    //抽取出长度
    let length = numericExtractRegex.exec(rule)[0];
    //判断是否抽取出来的为有效长度，如果无效则报错
    if (!numericRegex.test(length)) return false;
    if (rule.indexOf("min") > -1) {
      if (value.length < length) return false;
    }
    if (rule.indexOf("max") > -1) {
      if (value.length > length) return false;
    }
  }
  return true;
}
/**
 * @function 验证是否为手机号
 * @param rule
 * @param value
 * @return {boolean}
 * @private
 */
export function _isMobile(rule, value) {
  //判断是否为手机号
  if (rule === "mobile") {
    if (!mobileRegex.test(value)) return false;
  }
  return true;
}

/**
 * Description 自定义校验规则
 * @param data
 * @param rules
 * @param customMessage
 * @Todo 这里为了简便考虑，仅进行多次遍历
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
  let error = {};

  for (let property of Object.keys(rules)) {
    // 如果校验失败，则将错误加一
    if (!validateSingle(rules[property], data[property])) {
      isPass = false;
      errorCount++;
      error[property] = {
        rule: rules[property]
      };
    }
  }

  return {
    isPass,
    errorCount,
    error
  };
}

/**
 * @function
 *
 * required 必填项
 * email 电子邮箱
 * min-length[min] 最短长度
 * max-length[max] 最长长度
 * mobile 手机号
 *
 * @param ruleStr
 * @param value
 */
export function validateSingle(ruleStr = "required", value) {
  debug(ruleStr, value);

  //分割规则
  let rules = ruleStr.split("|");
  //判断required的位置
  let indexOfRequired = rules.indexOf("required");
  let isEmpty = !value || value === "" || value === undefined;
  //如果为空并且不存在必要条件
  if (isEmpty && indexOfRequired === -1) {
    return true;
  }
  //遍历所有的规则
  for (let rule of rules) {
    //依次遍历所有的待校验项目
    let result =
      _isRequired(rule, value) &&
      _isEmail(rule, value) &&
      _isFixedLength(rule, value) &&
      _isMobile(rule, value);
    if (!result) return false;
  }
  return true;
}

export async function validateAsync() {}
