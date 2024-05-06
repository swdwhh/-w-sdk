import dsBridge from "dsbridge";
import { getUserInfo, getUserInfoSync } from "./getUserInfo";
import { setNavigationStyle } from "./setNavigationStyle";
import { navigateBack } from "./navigateBack";
import { pushPage } from "./pushPage";
import { popPage } from "./popPage";
import { chooseImage } from "./chooseImage";
import { examSuccess } from "./examSuccess";
import { makeVibrationSync } from "./makeVibrationSync";

/**
 * 文件
 */
import { openDocument } from "@wahaha/bpm-sdk-file";

/**
 * 位置
 */
import { getLocation } from "@wahaha/bpm-sdk-location";

/**
 * 设备
 */
import { scanCode } from "@wahaha/bpm-sdk-device";



/**
 * 动作类
 */
import { updateAppIconBadgeNumber } from "@wahaha/bpm-sdk-actions";



export {
  dsBridge,
  getUserInfo,
  navigateBack,
  getUserInfoSync,
  setNavigationStyle,
  pushPage,
  popPage,
  chooseImage,
  examSuccess,
  openDocument,
  getLocation,
  makeVibrationSync,
  scanCode,
  updateAppIconBadgeNumber,
};
