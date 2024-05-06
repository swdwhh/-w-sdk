import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

export function getLocation({ success, fail }) {
  dsBridge.call("getLocation", function (v) {
    callbackhandler(v, { success, fail });
  });
}
