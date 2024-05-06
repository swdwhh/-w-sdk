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

exports.callbackPipe = callbackPipe;
exports.callbackhandler = callbackhandler;
