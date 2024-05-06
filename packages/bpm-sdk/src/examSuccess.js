import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

/**
 * @description 考试成功回调
 * @param params.success  成功回调 Object object
 * @param params.fail  失败回调
 */
export function examSuccess({
  success,
  fail,
  ...others
}) {
  dsBridge.call(
    "examSuccess",
    { ...others },
    function (v) {
      callbackhandler(v, { success, fail });
    }
  );
}
