import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

/**
 * @description 导航栏样式，
 * @param {*} value default 默认样式 custom 自定义导航栏 (仅支持以下值)
 */
export function setNavigationStyle({ value = "default", success, fail }) {
  dsBridge.call("setNavigationStyle", value, function (v) {
    callbackhandler(v, { success, fail });
  });
}

/**
 * @description setNavigationStyle 同步版本
 * @param {*} value
 */

export function setNavigationStyleSync({ value = "default" }) {
  dsBridge.call("setNavigationStyleSync", value);
}
