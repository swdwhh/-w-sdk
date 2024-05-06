import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

export function popPage({ success, fail }) {
  dsBridge.call("popPage", function (v) {
    callbackhandler(v, { success, fail });
  });
}
