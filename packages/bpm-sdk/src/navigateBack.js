import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

/**
 * @description 页面级返回 返回上一页面或多级页面
 * @param {*} delta 返回的层数
 */
export function navigateBack({ delta = 1, success, fail }) {
  dsBridge.call("navigateBack", { delta }, function (v) {
    callbackhandler(v, { success, fail });
  });
}
