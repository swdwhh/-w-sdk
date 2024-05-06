import { callbackhandler } from "@wahaha/bpm-sdk-utils";

/**
 * @description 新开页面打开文档
 *
 * @param {Object} params 参数 Object object
 * @param {String} params.filePath 文件路径（支持远程文件）required
 * @param {String} params.fileType 文件格式（支持远程文件）不传则APP自动识别
 * @param {Function} params.success 接口调用成功的回调函数
 * @param {Function} params.fail 接口调用失败的回调函数
 *
 */

export function openDocument(params) {
  const { filePath, fileType = "", success, fail } = params;
  dsBridge.call("openDocument", { filePath, fileType }, function (response) {
    callbackhandler(response, { success, fail });
  });
}
