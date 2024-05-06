'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var callbackPipe = function callbackPipe(object) {
  var success = object.success,
      fail = object.fail;
  return [success, fail];
};
/**
 *
 * @param {*} v 回调的参数
 * @param {*} params 传入的参数
 * @returns v 回调的参数
 */


function callbackhandler(callbackParams, params) {
  var _callbackPipe = callbackPipe(params),
      success = _callbackPipe[0],
      fail = _callbackPipe[1];

  if (typeof callbackParams === "undefined") {
    console.warn("回调参数（callback）有误，请联系原生开发人员");
    return;
  }

  console.log(callbackParams);
  var v = JSON.parse(callbackParams);
  var ok = v.ok;

  if (+ok !== 0 && +ok !== 1) {
    console.warn("回调参数（callback.ok）有误，请联系原生开发人员");
    return;
  }

  if (+ok === 0) {
    fail(v);
    return v;
  }

  success(v);
}

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

function openDocument(params) {
  var filePath = params.filePath,
      _params$fileType = params.fileType,
      fileType = _params$fileType === void 0 ? "" : _params$fileType,
      success = params.success,
      fail = params.fail;
  dsBridge.call("openDocument", {
    filePath: filePath,
    fileType: fileType
  }, function (response) {
    callbackhandler(response, {
      success: success,
      fail: fail
    });
  });
}

exports.openDocument = openDocument;
