import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

/**
 * @description 更新app应用角标数量。
 * @param params.success  成功回调 Object object
 * @param params.fail  失败回调
 */
export function updateAppIconBadgeNumber({ success, fail, ...others }) {
  dsBridge.call("updateAppIconBadgeNumber", { ...others }, function (v) {
    callbackhandler(v, { success, fail });
  });
}
