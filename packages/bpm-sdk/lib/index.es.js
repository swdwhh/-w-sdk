var commonjsGlobal$3 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var bridge$3 = {
  default: commonjsGlobal$3,
  // for typescript
  call: function call(method, args, cb) {
    var ret = '';

    if (typeof args == 'function') {
      cb = args;
      args = {};
    }

    var arg = {
      data: args === undefined ? null : args
    };

    if (typeof cb == 'function') {
      var cbName = 'dscb' + window.dscb++;
      window[cbName] = cb;
      arg['_dscbstub'] = cbName;
    }

    arg = JSON.stringify(arg); //if in webview that dsBridge provided, call!

    if (window._dsbridge) {
      ret = _dsbridge.call(method, arg);
    } else if (window._dswk || navigator.userAgent.indexOf("_dsbridge") != -1) {
      ret = prompt("_dsbridge=" + method, arg);
    }

    return JSON.parse(ret || '{}').data;
  },
  register: function register(name, fun, asyn) {
    var q = asyn ? window._dsaf : window._dsf;

    if (!window._dsInit) {
      window._dsInit = true; //notify native that js apis register successfully on next event loop

      setTimeout(function () {
        bridge$3.call("_dsb.dsinit");
      }, 0);
    }

    if (typeof fun == "object") {
      q._obs[name] = fun;
    } else {
      q[name] = fun;
    }
  },
  registerAsyn: function registerAsyn(name, fun) {
    this.register(name, fun, true);
  },
  hasNativeMethod: function hasNativeMethod(name, type) {
    return this.call("_dsb.hasNativeMethod", {
      name: name,
      type: type || "all"
    });
  },
  disableJavascriptDialogBlock: function disableJavascriptDialogBlock(disable) {
    this.call("_dsb.disableJavascriptDialogBlock", {
      disable: disable !== false
    });
  }
};
!function () {
  if (window._dsf) return;
  var ob = {
    _dsf: {
      _obs: {}
    },
    _dsaf: {
      _obs: {}
    },
    dscb: 0,
    dsBridge: bridge$3,
    close: function close() {
      bridge$3.call("_dsb.closePage");
    },
    _handleMessageFromNative: function _handleMessageFromNative(info) {
      var arg = JSON.parse(info.data);
      var ret = {
        id: info.callbackId,
        complete: true
      };
      var f = this._dsf[info.method];
      var af = this._dsaf[info.method];

      var callSyn = function callSyn(f, ob) {
        ret.data = f.apply(ob, arg);
        bridge$3.call("_dsb.returnValue", ret);
      };

      var callAsyn = function callAsyn(f, ob) {
        arg.push(function (data, complete) {
          ret.data = data;
          ret.complete = complete !== false;
          bridge$3.call("_dsb.returnValue", ret);
        });
        f.apply(ob, arg);
      };

      if (f) {
        callSyn(f, this._dsf);
      } else if (af) {
        callAsyn(af, this._dsaf);
      } else {
        //with namespace
        var name = info.method.split('.');
        if (name.length < 2) return;
        var method = name.pop();
        var namespace = name.join('.');
        var obs = this._dsf._obs;
        var ob = obs[namespace] || {};
        var m = ob[method];

        if (m && typeof m == "function") {
          callSyn(m, ob);
          return;
        }

        obs = this._dsaf._obs;
        ob = obs[namespace] || {};
        m = ob[method];

        if (m && typeof m == "function") {
          callAsyn(m, ob);
          return;
        }
      }
    }
  };

  for (var attr in ob) {
    window[attr] = ob[attr];
  }

  bridge$3.register("_hasJavascriptMethod", function (method, tag) {
    var name = method.split('.');

    if (name.length < 2) {
      return !!(_dsf[name] || _dsaf[name]);
    } else {
      // with namespace
      var method = name.pop();
      var namespace = name.join('.');
      var ob = _dsf._obs[namespace] || _dsaf._obs[namespace];
      return ob && !!ob[method];
    }
  });
}();
var dsbridge$3 = bridge$3;

var callbackPipe$4 = function callbackPipe(object) {
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


function callbackhandler$4(callbackParams, params) {
  var _callbackPipe = callbackPipe$4(params),
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

function getUserInfo(_ref) {
  var success = _ref.success,
      fail = _ref.fail;
  dsbridge$3.call("getUserInfo", function (v) {
    callbackhandler$4(v, {
      success: success,
      fail: fail
    });
  });
}
function getUserInfoSync() {
  var info = dsbridge$3.call("getUserInfoSync");
  return info;
}

/**
 * @description 导航栏样式，
 * @param {*} value default 默认样式 custom 自定义导航栏 (仅支持以下值)
 */

function setNavigationStyle(_ref) {
  var _ref$value = _ref.value,
      value = _ref$value === void 0 ? "default" : _ref$value,
      success = _ref.success,
      fail = _ref.fail;
  dsbridge$3.call("setNavigationStyle", value, function (v) {
    callbackhandler$4(v, {
      success: success,
      fail: fail
    });
  });
}

/**
 * @description 页面级返回 返回上一页面或多级页面
 * @param {*} delta 返回的层数
 */

function navigateBack(_ref) {
  var _ref$delta = _ref.delta,
      delta = _ref$delta === void 0 ? 1 : _ref$delta,
      success = _ref.success,
      fail = _ref.fail;
  dsbridge$3.call("navigateBack", {
    delta: delta
  }, function (v) {
    callbackhandler$4(v, {
      success: success,
      fail: fail
    });
  });
}

function pushPage(_ref) {
  var url = _ref.url,
      success = _ref.success,
      fail = _ref.fail;
  dsbridge$3.call("pushPage", url, function (v) {
    callbackhandler$4(v, {
      success: success,
      fail: fail
    });
  });
}

function popPage(_ref) {
  var success = _ref.success,
      fail = _ref.fail;
  dsbridge$3.call("popPage", function (v) {
    callbackhandler$4(v, {
      success: success,
      fail: fail
    });
  });
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

var _excluded$3 = ["count", "sourceType", "isBpm", "bpmType", "success", "fail"];

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$3(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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

function chooseImage(_ref) {
  var _ref$count = _ref.count,
      count = _ref$count === void 0 ? 1 : _ref$count,
      _ref$sourceType = _ref.sourceType,
      sourceType = _ref$sourceType === void 0 ? ["album", "camera"] : _ref$sourceType,
      isBpm = _ref.isBpm,
      bpmType = _ref.bpmType,
      success = _ref.success,
      fail = _ref.fail,
      others = _objectWithoutPropertiesLoose(_ref, _excluded$3);

  dsbridge$3.call("chooseImage", _objectSpread$3({
    count: count,
    sourceType: sourceType,
    isBpm: isBpm,
    bpmType: bpmType
  }, others), function (v) {
    callbackhandler$4(v, {
      success: success,
      fail: fail
    });
  });
}

var _excluded$2 = ["success", "fail"];

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$2(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
/**
 * @description 考试成功回调
 * @param params.success  成功回调 Object object
 * @param params.fail  失败回调
 */

function examSuccess(_ref) {
  var success = _ref.success,
      fail = _ref.fail,
      others = _objectWithoutPropertiesLoose(_ref, _excluded$2);

  dsbridge$3.call("examSuccess", _objectSpread$2({}, others), function (v) {
    callbackhandler$4(v, {
      success: success,
      fail: fail
    });
  });
}

function makeVibrationSync(_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
      _ref$vibrationNum = _ref.vibrationNum,
      vibrationNum = _ref$vibrationNum === void 0 ? 1 : _ref$vibrationNum,
      _ref$vibrationInterva = _ref.vibrationInterval,
      vibrationInterval = _ref$vibrationInterva === void 0 ? 1000 : _ref$vibrationInterva,
      _ref$ifRepeat = _ref.ifRepeat,
      ifRepeat = _ref$ifRepeat === void 0 ? false : _ref$ifRepeat,
      _ref$vibrationTime = _ref.vibrationTime,
      vibrationTime = _ref$vibrationTime === void 0 ? 1000 : _ref$vibrationTime;

  dsbridge$3.call("makeVibrationSync", {
    vibrationNum: vibrationNum,
    vibrationInterval: vibrationInterval,
    ifRepeat: ifRepeat,
    vibrationTime: vibrationTime
  });
}

var callbackPipe$3 = function callbackPipe(object) {
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


function callbackhandler$3(callbackParams, params) {
  var _callbackPipe = callbackPipe$3(params),
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
    callbackhandler$3(response, {
      success: success,
      fail: fail
    });
  });
}

var commonjsGlobal$2 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
var bridge$2 = {
  default: commonjsGlobal$2,
  // for typescript
  call: function call(method, args, cb) {
    var ret = '';

    if (typeof args == 'function') {
      cb = args;
      args = {};
    }

    var arg = {
      data: args === undefined ? null : args
    };

    if (typeof cb == 'function') {
      var cbName = 'dscb' + window.dscb++;
      window[cbName] = cb;
      arg['_dscbstub'] = cbName;
    }

    arg = JSON.stringify(arg); //if in webview that dsBridge provided, call!

    if (window._dsbridge) {
      ret = _dsbridge.call(method, arg);
    } else if (window._dswk || navigator.userAgent.indexOf("_dsbridge") != -1) {
      ret = prompt("_dsbridge=" + method, arg);
    }

    return JSON.parse(ret || '{}').data;
  },
  register: function register(name, fun, asyn) {
    var q = asyn ? window._dsaf : window._dsf;

    if (!window._dsInit) {
      window._dsInit = true; //notify native that js apis register successfully on next event loop

      setTimeout(function () {
        bridge$2.call("_dsb.dsinit");
      }, 0);
    }

    if (typeof fun == "object") {
      q._obs[name] = fun;
    } else {
      q[name] = fun;
    }
  },
  registerAsyn: function registerAsyn(name, fun) {
    this.register(name, fun, true);
  },
  hasNativeMethod: function hasNativeMethod(name, type) {
    return this.call("_dsb.hasNativeMethod", {
      name: name,
      type: type || "all"
    });
  },
  disableJavascriptDialogBlock: function disableJavascriptDialogBlock(disable) {
    this.call("_dsb.disableJavascriptDialogBlock", {
      disable: disable !== false
    });
  }
};
!function () {
  if (window._dsf) return;
  var ob = {
    _dsf: {
      _obs: {}
    },
    _dsaf: {
      _obs: {}
    },
    dscb: 0,
    dsBridge: bridge$2,
    close: function close() {
      bridge$2.call("_dsb.closePage");
    },
    _handleMessageFromNative: function _handleMessageFromNative(info) {
      var arg = JSON.parse(info.data);
      var ret = {
        id: info.callbackId,
        complete: true
      };
      var f = this._dsf[info.method];
      var af = this._dsaf[info.method];

      var callSyn = function callSyn(f, ob) {
        ret.data = f.apply(ob, arg);
        bridge$2.call("_dsb.returnValue", ret);
      };

      var callAsyn = function callAsyn(f, ob) {
        arg.push(function (data, complete) {
          ret.data = data;
          ret.complete = complete !== false;
          bridge$2.call("_dsb.returnValue", ret);
        });
        f.apply(ob, arg);
      };

      if (f) {
        callSyn(f, this._dsf);
      } else if (af) {
        callAsyn(af, this._dsaf);
      } else {
        //with namespace
        var name = info.method.split('.');
        if (name.length < 2) return;
        var method = name.pop();
        var namespace = name.join('.');
        var obs = this._dsf._obs;
        var ob = obs[namespace] || {};
        var m = ob[method];

        if (m && typeof m == "function") {
          callSyn(m, ob);
          return;
        }

        obs = this._dsaf._obs;
        ob = obs[namespace] || {};
        m = ob[method];

        if (m && typeof m == "function") {
          callAsyn(m, ob);
          return;
        }
      }
    }
  };

  for (var attr in ob) {
    window[attr] = ob[attr];
  }

  bridge$2.register("_hasJavascriptMethod", function (method, tag) {
    var name = method.split('.');

    if (name.length < 2) {
      return !!(_dsf[name] || _dsaf[name]);
    } else {
      // with namespace
      var method = name.pop();
      var namespace = name.join('.');
      var ob = _dsf._obs[namespace] || _dsaf._obs[namespace];
      return ob && !!ob[method];
    }
  });
}();
var dsbridge$2 = bridge$2;

var callbackPipe$2 = function callbackPipe(object) {
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


function callbackhandler$2(callbackParams, params) {
  var _callbackPipe = callbackPipe$2(params),
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

function getLocation(_ref) {
  var success = _ref.success,
      fail = _ref.fail;
  dsbridge$2.call("getLocation", function (v) {
    callbackhandler$2(v, {
      success: success,
      fail: fail
    });
  });
}

var _excluded$1 = ["scanType", "success", "fail"];

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys$1(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var commonjsGlobal$1 = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
var bridge$1 = {
  default: commonjsGlobal$1,
  // for typescript
  call: function call(method, args, cb) {
    var ret = '';

    if (typeof args == 'function') {
      cb = args;
      args = {};
    }

    var arg = {
      data: args === undefined ? null : args
    };

    if (typeof cb == 'function') {
      var cbName = 'dscb' + window.dscb++;
      window[cbName] = cb;
      arg['_dscbstub'] = cbName;
    }

    arg = JSON.stringify(arg); //if in webview that dsBridge provided, call!

    if (window._dsbridge) {
      ret = _dsbridge.call(method, arg);
    } else if (window._dswk || navigator.userAgent.indexOf("_dsbridge") != -1) {
      ret = prompt("_dsbridge=" + method, arg);
    }

    return JSON.parse(ret || '{}').data;
  },
  register: function register(name, fun, asyn) {
    var q = asyn ? window._dsaf : window._dsf;

    if (!window._dsInit) {
      window._dsInit = true; //notify native that js apis register successfully on next event loop

      setTimeout(function () {
        bridge$1.call("_dsb.dsinit");
      }, 0);
    }

    if (typeof fun == "object") {
      q._obs[name] = fun;
    } else {
      q[name] = fun;
    }
  },
  registerAsyn: function registerAsyn(name, fun) {
    this.register(name, fun, true);
  },
  hasNativeMethod: function hasNativeMethod(name, type) {
    return this.call("_dsb.hasNativeMethod", {
      name: name,
      type: type || "all"
    });
  },
  disableJavascriptDialogBlock: function disableJavascriptDialogBlock(disable) {
    this.call("_dsb.disableJavascriptDialogBlock", {
      disable: disable !== false
    });
  }
};
!function () {
  if (window._dsf) return;
  var ob = {
    _dsf: {
      _obs: {}
    },
    _dsaf: {
      _obs: {}
    },
    dscb: 0,
    dsBridge: bridge$1,
    close: function close() {
      bridge$1.call("_dsb.closePage");
    },
    _handleMessageFromNative: function _handleMessageFromNative(info) {
      var arg = JSON.parse(info.data);
      var ret = {
        id: info.callbackId,
        complete: true
      };
      var f = this._dsf[info.method];
      var af = this._dsaf[info.method];

      var callSyn = function callSyn(f, ob) {
        ret.data = f.apply(ob, arg);
        bridge$1.call("_dsb.returnValue", ret);
      };

      var callAsyn = function callAsyn(f, ob) {
        arg.push(function (data, complete) {
          ret.data = data;
          ret.complete = complete !== false;
          bridge$1.call("_dsb.returnValue", ret);
        });
        f.apply(ob, arg);
      };

      if (f) {
        callSyn(f, this._dsf);
      } else if (af) {
        callAsyn(af, this._dsaf);
      } else {
        //with namespace
        var name = info.method.split('.');
        if (name.length < 2) return;
        var method = name.pop();
        var namespace = name.join('.');
        var obs = this._dsf._obs;
        var ob = obs[namespace] || {};
        var m = ob[method];

        if (m && typeof m == "function") {
          callSyn(m, ob);
          return;
        }

        obs = this._dsaf._obs;
        ob = obs[namespace] || {};
        m = ob[method];

        if (m && typeof m == "function") {
          callAsyn(m, ob);
          return;
        }
      }
    }
  };

  for (var attr in ob) {
    window[attr] = ob[attr];
  }

  bridge$1.register("_hasJavascriptMethod", function (method, tag) {
    var name = method.split('.');

    if (name.length < 2) {
      return !!(_dsf[name] || _dsaf[name]);
    } else {
      // with namespace
      var method = name.pop();
      var namespace = name.join('.');
      var ob = _dsf._obs[namespace] || _dsaf._obs[namespace];
      return ob && !!ob[method];
    }
  });
}();
var dsbridge$1 = bridge$1;

var callbackPipe$1 = function callbackPipe(object) {
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


function callbackhandler$1(callbackParams, params) {
  var _callbackPipe = callbackPipe$1(params),
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

function scanCode(_ref) {
  var _ref$scanType = _ref.scanType,
      scanType = _ref$scanType === void 0 ? 1 : _ref$scanType,
      success = _ref.success,
      fail = _ref.fail,
      others = _objectWithoutPropertiesLoose(_ref, _excluded$1);

  dsbridge$1.call("scanCode", _objectSpread$1({
    scanType: scanType
  }, others), function (v) {
    callbackhandler$1(v, {
      success: success,
      fail: fail
    });
  });
}

var _excluded = ["success", "fail"];

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};
var bridge = {
  default: commonjsGlobal,
  // for typescript
  call: function call(method, args, cb) {
    var ret = '';

    if (typeof args == 'function') {
      cb = args;
      args = {};
    }

    var arg = {
      data: args === undefined ? null : args
    };

    if (typeof cb == 'function') {
      var cbName = 'dscb' + window.dscb++;
      window[cbName] = cb;
      arg['_dscbstub'] = cbName;
    }

    arg = JSON.stringify(arg); //if in webview that dsBridge provided, call!

    if (window._dsbridge) {
      ret = _dsbridge.call(method, arg);
    } else if (window._dswk || navigator.userAgent.indexOf("_dsbridge") != -1) {
      ret = prompt("_dsbridge=" + method, arg);
    }

    return JSON.parse(ret || '{}').data;
  },
  register: function register(name, fun, asyn) {
    var q = asyn ? window._dsaf : window._dsf;

    if (!window._dsInit) {
      window._dsInit = true; //notify native that js apis register successfully on next event loop

      setTimeout(function () {
        bridge.call("_dsb.dsinit");
      }, 0);
    }

    if (typeof fun == "object") {
      q._obs[name] = fun;
    } else {
      q[name] = fun;
    }
  },
  registerAsyn: function registerAsyn(name, fun) {
    this.register(name, fun, true);
  },
  hasNativeMethod: function hasNativeMethod(name, type) {
    return this.call("_dsb.hasNativeMethod", {
      name: name,
      type: type || "all"
    });
  },
  disableJavascriptDialogBlock: function disableJavascriptDialogBlock(disable) {
    this.call("_dsb.disableJavascriptDialogBlock", {
      disable: disable !== false
    });
  }
};
!function () {
  if (window._dsf) return;
  var ob = {
    _dsf: {
      _obs: {}
    },
    _dsaf: {
      _obs: {}
    },
    dscb: 0,
    dsBridge: bridge,
    close: function close() {
      bridge.call("_dsb.closePage");
    },
    _handleMessageFromNative: function _handleMessageFromNative(info) {
      var arg = JSON.parse(info.data);
      var ret = {
        id: info.callbackId,
        complete: true
      };
      var f = this._dsf[info.method];
      var af = this._dsaf[info.method];

      var callSyn = function callSyn(f, ob) {
        ret.data = f.apply(ob, arg);
        bridge.call("_dsb.returnValue", ret);
      };

      var callAsyn = function callAsyn(f, ob) {
        arg.push(function (data, complete) {
          ret.data = data;
          ret.complete = complete !== false;
          bridge.call("_dsb.returnValue", ret);
        });
        f.apply(ob, arg);
      };

      if (f) {
        callSyn(f, this._dsf);
      } else if (af) {
        callAsyn(af, this._dsaf);
      } else {
        //with namespace
        var name = info.method.split('.');
        if (name.length < 2) return;
        var method = name.pop();
        var namespace = name.join('.');
        var obs = this._dsf._obs;
        var ob = obs[namespace] || {};
        var m = ob[method];

        if (m && typeof m == "function") {
          callSyn(m, ob);
          return;
        }

        obs = this._dsaf._obs;
        ob = obs[namespace] || {};
        m = ob[method];

        if (m && typeof m == "function") {
          callAsyn(m, ob);
          return;
        }
      }
    }
  };

  for (var attr in ob) {
    window[attr] = ob[attr];
  }

  bridge.register("_hasJavascriptMethod", function (method, tag) {
    var name = method.split('.');

    if (name.length < 2) {
      return !!(_dsf[name] || _dsaf[name]);
    } else {
      // with namespace
      var method = name.pop();
      var namespace = name.join('.');
      var ob = _dsf._obs[namespace] || _dsaf._obs[namespace];
      return ob && !!ob[method];
    }
  });
}();
var dsbridge = bridge;

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
 * @description 更新app应用角标数量。
 * @param params.success  成功回调 Object object
 * @param params.fail  失败回调
 */


function updateAppIconBadgeNumber(_ref) {
  var success = _ref.success,
      fail = _ref.fail,
      others = _objectWithoutPropertiesLoose(_ref, _excluded);

  dsbridge.call("updateAppIconBadgeNumber", _objectSpread({}, others), function (v) {
    callbackhandler(v, {
      success: success,
      fail: fail
    });
  });
}

export { chooseImage, dsbridge$3 as dsBridge, examSuccess, getLocation, getUserInfo, getUserInfoSync, makeVibrationSync, navigateBack, openDocument, popPage, pushPage, scanCode, setNavigationStyle, updateAppIconBadgeNumber };
