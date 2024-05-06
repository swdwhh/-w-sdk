import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

export function makeVibrationSync({vibrationNum = 1, vibrationInterval = 1000, ifRepeat = false, vibrationTime = 1000} = {}) {
  dsBridge.call("makeVibrationSync", { vibrationNum, vibrationInterval, ifRepeat, vibrationTime });
}
