import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

export function scanCode({ scanType = 1, success, fail, ...others }) {
  dsBridge.call("scanCode", { scanType, ...others }, function (v) {
    callbackhandler(v, { success, fail });
  });
}
