import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

export function getUserInfo({ success, fail }) {
  dsBridge.call("getUserInfo", function (v) {
    callbackhandler(v, { success, fail });
  });
}

export function getUserInfoSync() {
  const info = dsBridge.call("getUserInfoSync");
  return info;
}
