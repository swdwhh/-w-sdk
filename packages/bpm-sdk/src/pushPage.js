import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

export function pushPage({ url, success, fail }) {
  dsBridge.call("pushPage", url, function (v) {
    callbackhandler(v, { success, fail });
  });
}
