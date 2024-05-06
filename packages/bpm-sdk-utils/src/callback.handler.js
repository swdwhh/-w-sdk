import { callbackPipe } from "./callback.pipe";

/**
 *
 * @param {*} v 回调的参数
 * @param {*} params 传入的参数
 * @returns v 回调的参数
 */
export function callbackhandler(callbackParams, params) {
  const [success, fail] = callbackPipe(params);
  if (typeof callbackParams === "undefined") {
    console.warn("回调参数（callback）有误，请联系原生开发人员");
    return;
  }

  console.log(callbackParams);

  const v = JSON.parse(callbackParams);

  const { ok } = v;

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
