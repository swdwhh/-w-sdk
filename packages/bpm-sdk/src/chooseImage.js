import dsBridge from "dsbridge";
import { callbackhandler } from "@wahaha/bpm-sdk-utils";

/**
 * @description 从本地相册选择图片或使用相机拍照。
 * @param {*} params Object object
 * @param params.count 最多获取图片数，最大9
 * @param params.sourceType  [album, camera] album => 相册 camera => 拍照
 * @param params.isBpm 业务参数 required
 * @param params.bpmType 业务参数 required
 * @param params.success  成功回调 Object object
 * @param params.fail  失败回调
 */
export function chooseImage({
  count = 1,
  sourceType = ["album", "camera"],
  isBpm,
  bpmType,
  success,
  fail,
  ...others
}) {
  dsBridge.call(
    "chooseImage",
    { count, sourceType, isBpm, bpmType, ...others },
    function (v) {
      callbackhandler(v, { success, fail });
    }
  );
}
