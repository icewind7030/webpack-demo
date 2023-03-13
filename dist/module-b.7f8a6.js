"use strict";
(self["webpackChunkwebpack_demo"] = self["webpackChunkwebpack_demo"] || []).push([["module-b"],{

/***/ 3999:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* unused harmony exports support, callHandler, registerHandler, schemaCallHandler */
var bridgeCallbackQueue = (/* unused pure expression or super */ null && ([]));

function setupWebViewJavascriptBridge(callback) {
    if (window.NEJSBridge) {
        callback(NEJSBridge);
        return;
    }
    bridgeCallbackQueue.push(callback);

    var NEJSBridgeReady = false;
    document.addEventListener('NEJSBridgeReady', function () {
        NEJSBridgeReady = true;
        bridgeCallbackQueue.forEach(function (callback) {
            callback(NEJSBridge);
        });
        bridgeCallbackQueue = [];
    }, false);

    var notifyAppTimes = 0;
    function notifyAppLoaded() {
        notifyAppTimes++;
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'nejb://nejb_loaded';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function () {
            document.documentElement.removeChild(WVJBIframe);
        }, 0);
    }
    notifyAppLoaded();
    var notifyAppTimer = setInterval(function () {
        if (notifyAppTimes < 6 && !NEJSBridgeReady) {
            notifyAppLoaded();
        } else {
            clearInterval(notifyAppTimer);
        }
    }, 300);
}

var callHandler$3 = function callHandler(actionName, data, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler(actionName, data, function (resp) {
            if (resp !== undefined) {
                try {
                    resp = JSON.parse(resp);
                } catch (e) {
                    console.log('JSON.parse error', resp, e);
                }
            }
            callback(resp);
        });
    });
};

var registerHandler$1 = function registerHandler(actionName, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler(actionName, function (resp, responseCallback) {
            if (resp !== undefined) {
                resp = JSON.parse(resp);
            }
            callback(resp, responseCallback);
        });
    });
};
/*
 * LOFTER老版bridge的数据用JSON.parse会报错，使用老版bridge的方式不做处理。
 */
var registerHandler4OldLofter = function registerHandler4OldLofter(actionName, callback) {
    setupWebViewJavascriptBridge(function (bridge) {
        bridge.registerHandler(actionName, function (resp, responseCallback) {
            callback(resp, responseCallback);
        });
    });
};

var stringify = function stringify(query) {
    if (typeof query == 'string') return query;

    var i;
    var result = [];

    for (i in query) {
        if (query.hasOwnProperty(i)) {
            result.push(i + '=' + encodeURIComponent(query[i]));
        }
    }

    return result.join('&');
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};

var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

function connectToNative(url, isInApp) {
    if (!isInApp) {
        window.location.href = url;
        return;
    }

    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = url;
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe);
    }, 0);
}

var setValueByPath = function setValueByPath(path, value) {
    var array = path.split('.');

    array.reduce(function (acc, currentValue, currentIndex, array) {

        if (currentIndex === array.length - 1) {
            acc[currentValue] = value;
        } else if (acc[currentValue] === undefined || acc[currentValue] === null) {
            acc[currentValue] = {};
        }

        return acc[currentValue];
    }, window);
};

var callHandler$4 = function callHandler(actionName, data, callback, isInApp) {
    var seperator = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '?';


    if ((typeof callback === 'undefined' ? 'undefined' : _typeof(callback)) === 'object' && callback !== null) {

        if (callback.name !== undefined) {
            setValueByPath(callback.name, function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                if (typeof callback.handler === 'function') {
                    callback.handler.apply(null, args);
                }
                setValueByPath(callback.name, null);
            });
        }
    }
    var url = actionName + seperator + stringify(data);
    connectToNative(url, isInApp);
};

var patternResult = navigator.userAgent.match(/NEJSBridge\/([\d.]+)\b/);

var isJsbridgeCapable = !!patternResult;

var callHandler$2 = (/* unused pure expression or super */ null && (isJsbridgeCapable ? callHandler$3 : callHandler$4));

var libSupport = function libSupport(actionName, versionMap) {
    if (!isJsbridgeCapable || !(actionName in versionMap)) {
        return false;
    }
    var sinceVersoin = versionMap[actionName];
    var currentVersion = parseInt(patternResult[1], 10);

    return sinceVersoin <= currentVersion;
};

var APIAbstract = function () {
    function APIAbstract() {
        classCallCheck(this, APIAbstract);
    }

    createClass(APIAbstract, [{
        key: 'getLegacyProtocolConfig',
        value: function getLegacyProtocolConfig(actionName, data) {
            
        }
    }, {
        key: 'getComputedUrl',
        value: function getComputedUrl(path) {
            if (/^[\w0-9]+:\/\//.test(path)) {
                //'necomics://manhua.163.com/v1', nereader://yuedu.163.com/v1?
                return path;
            }

            return this.schemaName_ + '://' + path;
        }
    }]);
    return APIAbstract;
}();

var APIInstance = void 0;

var schemaCallHandler = function schemaCallHandler(API, actionName, data, callback, seperator) {
    APIInstance = APIInstance || new API();

    var obj = APIInstance.getLegacyProtocolConfig(actionName, data) || {};

    actionName = obj.actionName || actionName;
    data = obj.data || data;
    if (data.seperator !== undefined) {
        seperator = data.seperator; //兼容'neteasereaderuri://entryid=cf3587af574a4056a798878f59fa1b60_4&type=2'
    }

    var oCallback = null;

    if (callback) {
        oCallback = {};
        if (typeof obj.callback === 'string') {
            oCallback.name = obj.callback;
            oCallback.handler = callback;
        } else if (obj.callback !== undefined) {

            if (obj.callback.name === undefined) {
                throw new Error('callback name must be provided');
            }

            oCallback.name = obj.callback.name;
            oCallback.handler = function () {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                if (typeof obj.callback.handler === 'function') {
                    var _result = obj.callback.handler.apply(null, args);
                    callback(_result);
                } else {
                    callback.apply(null, result);
                }
            };
        }
    }

    var isInApp = APIInstance.isInApp();

    if (actionName === 'pageRedirect') {
        var path = APIInstance.getComputedUrl(data.path);

        callHandler$2(path, data.query, oCallback, isInApp, seperator);
    } else {
        var _path = APIInstance.getComputedUrl(actionName);

        callHandler$2(_path, data, oCallback, isInApp, seperator);
    }
};

var jsbridgeCallHandler = function jsbridgeCallHandler(API, actionName, data, callback) {
    var seperator = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '?';

    APIInstance = APIInstance || new API();

    if (actionName === 'pageRedirect') {
        var path = void 0;
        var query = void 0;
        var close = void 0;
        var obj = APIInstance.getLegacyProtocolConfig(actionName, data);

        if (obj) {
            obj = obj.data;
            path = obj.path || data.path;
            query = obj.query || data.query;
            if (obj.seperator !== undefined) {
                seperator = obj.seperator; //兼容'neteasereaderuri://entryid=cf3587af574a4056a798878f59fa1b60_4&type=2'
            }
        } else {
            path = data.path;
            query = data.query;
            close = data.close;
        }

        path = APIInstance.getComputedUrl(path);

        data = { actionUrl: path + seperator + stringify(query) };
        if (close) {
            data.close = close;
        }
    }

    callHandler$2(actionName, data, callback);
};

var doCallHandler = (/* unused pure expression or super */ null && (isJsbridgeCapable ? jsbridgeCallHandler : schemaCallHandler));

var callHandler$1 = function callHandler$$1(API, actionName) {
    var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = arguments[3];
    var seperator = arguments[4];

    if (typeof data === 'function') {
        callback = data;
        data = {};
    }

    doCallHandler(API, actionName, data, callback, seperator);
};

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var map = {
    playBackgroundMusic: 1,
    njb_cbShareResult: 2,
    njb_setAutoLoginAccountInfo: 3,
    njb_setPageTitle: 4,
    njb_editor_command: 5,
    njb_editor_status: 5,
    njb_editor_getCaret: 5,
    njb_webview_log: 5,
    njb_getDeviceInfo: 6,
    njb_cbCloseWebview: 7,
    njb_updateClient: 7,
    njb_closeCurrentWebview: 7,
    njb_share: 7,
    njb_getAppLog: 7,
    njb_providePullDownRefresh: 7,
    njb_login: 8,
    njb_check_storage_permission: 8, // app 6.9.5
    njb_apply_storage_permission: 8, // app 6.9.5
    njb_reportLogToApp: 9,
    njb_has_applied_unforbid: 10,
    njb_check_notice_permission: 11,
    njb_go_notice_permission: 11,
    njb_getWebViewSessionId: 12,
    njb_live_list_send_gift: 13,
    njb_live_room_user: 13,
    njb_live_room_replay: 14,
    njb_setNavColor: 15,
    njb_provideProgressBar: 15,
    njb_webviewCompleted: 15,
    njb_shareSingleImage: 15,
    njb_noticePageStatus: 16,
    showActionMenu: 17,
    njb_setAppMode: 18,
    njb_recharge: 19,
    njb_changeAvatarBox: 19,
    njb_luckBoyConfig: 20,
    njb_getWebviewCount: 21,
    njb_playAd: 22,
    njb_playAdCallback: 22,
    njb_getABTestConfig: 23,
    njb_publish: 24,
    njb_handleWebCookie: 25,
    njb_unlock_more: 26,
    njb_changeUserSuit: 27,
    njb_getTrySuitStatus: 27,
    njb_trySuit: 27,
    njb_agreement: 28,
    njb_getPostContent: 29
};

var support = function support(actionName) {
    return libSupport(actionName, map);
};

var pageShowActions = {};
if (window.addEventListener) {
    window.addEventListener('pageshow', function (event) {
        if (event.persisted || window.performance && window.performance.navigation.type === 2) {
            for (var pageShowActionsKey in pageShowActions) {
                if (typeof pageShowActions[pageShowActionsKey] === 'function') {
                    pageShowActions[pageShowActionsKey]();
                }
            }
        }
    }, false);
}

var getAppVersion = function getAppVersion() {
    var userAgent = navigator.userAgent;

    if (!userAgent.match(/(iPhone|iPad)/) && !userAgent.match(/Android/)) {
        return false;
    }

    var clientVersionPatternArray = null;
    if (userAgent.match(/(iPhone|iPad)/)) {
        clientVersionPatternArray = userAgent.match(/\bLofter-iPhone ([.0-9]+)\b/i);
    } else if (userAgent.match(/Android/)) {
        clientVersionPatternArray = userAgent.match(/\bLofter-android\/([.0-9]+)\b/i);
    }

    if (!clientVersionPatternArray) {
        return false;
    }

    var clientVersionArray = clientVersionPatternArray[1].split('.');
    return {
        mainVersion: parseInt(clientVersionArray[0], 10),
        subVersion: parseInt(clientVersionArray[1], 10)
    };
};

var getShouldUseNewSchema = function getShouldUseNewSchema() {
    var clientVersionObj = getAppVersion();

    if (!clientVersionObj) return false;

    if (clientVersionObj.mainVersion > 2 || clientVersionObj.mainVersion === 2 && clientVersionObj.subVersion >= 4) {
        return true;
    }

    return false;
};

var getPageRedirectData = function getPageRedirectData(data) {
    var shouldUseNewSchema = getShouldUseNewSchema();

    var action = void 0;
    var a = void 0;
    var newSchemaQuery = {};
    var defaultQuery = {};

    switch (data.path) {

        case 'webview':
            action = 1;
            newSchemaQuery.url = data.query.url;

            if (data.query.auth) {
                newSchemaQuery.auth = data.query.auth;
            }

            if (data.query.title) {
                newSchemaQuery.title = data.query.title;
            }

            defaultQuery.url = data.query.url;

            break;
    }

    var newSchemaPath = 'necomics://manhua.163.com/v1';

    newSchemaQuery.action = action;

    if (shouldUseNewSchema) {
        return {
            path: newSchemaPath,
            query: newSchemaQuery
        };
    }

    if (a) {
        defaultQuery.a = a;
    }

    defaultQuery.actionUrl = newSchemaPath + '?' + stringify(newSchemaQuery);

    return {
        path: 'shareCallback',
        query: defaultQuery
    };
};



/**
 * 老的jsbridge调用
 */
var connectWebViewJavascriptBridge = function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge);
        }, false);
    }
};

var jbCallHandler4Ios = function jbCallHandler4Ios(_actionName, _data, _callback) {
    connectWebViewJavascriptBridge(function (bridge) {
        bridge.callHandler(_actionName, _data, _callback);
    });
};

var jbRegisterHandler4Ios = function jbRegisterHandler4Ios(_actionName, _callback) {
    connectWebViewJavascriptBridge(function (bridge) {
        bridge.init(function (responseCallback) {
            responseCallback(data);
        });
        bridge.registerHandler(_actionName, _callback);
    });
};

var APILofter = function (_APIAbstract) {
    inherits(APILofter, _APIAbstract);

    function APILofter() {
        classCallCheck(this, APILofter);

        var _this = possibleConstructorReturn(this, (APILofter.__proto__ || Object.getPrototypeOf(APILofter)).call(this));

        _this.schemaName_ = 'neteaselofter';
        return _this;
    }

    createClass(APILofter, [{
        key: 'isInApp',
        value: function isInApp() {
            return navigator.userAgent.indexOf('Lofter') !== -1;
        }
    }, {
        key: 'getLegacyProtocolConfig',
        value: function getLegacyProtocolConfig(actionName, data) {
            switch (actionName) {
                /**
                 * @api {post} saveShareContent 传给客户端保存待分享的内容
                 * @apiName saveShareContent
                 * @apiGroup General
                 * @apiDescription 传给客户端保存待分享的内容
                 * @apiParam {Object}         shareCnt   需要分享的内容
                 * @apiParam (shareCnt)       {Number}   id              分享id，固定为6002即可
                 * @apiParam (shareCnt)       {String}   url             分享链接
                 * @apiParam (shareCnt)       {Object}   content         分享内容数据对象
                 * @apiParam (content)        {String}   weiboImg        微博分享图片
                 * @apiParam (content)        {String}   weiboDesc       微博分享描述
                 * @apiParam (content)        {String}   fImg            微信分享图片
                 * @apiParam (content)        {String}   fDesc           微信分享描述
                 * @apiParam (content)        {String}   fTitle          微信分享标题
                 * @apiParam (content)        {Array}    domains         传空数组即可
                 * @apiParam (content)        {Object}   lofterContent   lofter分享内容
                 * @apiParam (lofterContent)  {String}   lTitle          lofter分享标题
                 * @apiParam (lofterContent)  {String}   lImg            lofter分享图片
                 * @apiParam (lofterContent)  {String}   price           lofter分享价格
                 * @apiParam (lofterContent)  {String}   ext             lofter分享预留字段
                 */

                case 'saveShareContent':
                    return {
                        actionName: 'saveShareContent',
                        data: data ? data : {}
                    };

                /**
                 * @api {get} showMenu 弹出分享组件
                 * @apiName showMenu
                 * @apiGroup General
                 * @apiDescription 弹出分享组件
                 */

                case 'showMenu':

                    return {
                        actionName: 'showMenu'

                        /**
                         * @api {get} hideActionMenu 隐藏当前webview的分享按钮
                         * @apiName hideActionMenu
                         * @apiGroup General
                         * @apiDescription 隐藏当前webview的分享按钮
                         */

                    };case 'hideActionMenu':

                    return {
                        actionName: 'hideActionMenu'

                        /**
                         * @api {post} saveImage 下载图片到系统相册
                         * @apiName saveImage
                         * @apiGroup General
                         * @apiDescription 下载图片到系统相册
                         * @apiParam {Object}  imgdata  "{url:图片链接,data:图片的base64编码}"
                         * @apiParam (imgdata)  url     图片链接;url为空字符串时，启用下一个参数
                         * @apiParam (imgdata)  [data]  图片的base64编码
                         */

                    };case 'saveImage':
                    return {
                        actionName: 'saveImage',
                        data: data ? data : {}
                    };

                /**
                 * @api {get} pickAndUploadPhoto 从本地相册选择图片并上传
                 * @apiName pickAndUploadPhoto
                 * @apiGroup General
                 * @apiDescription 从本地相册选择图片并上传
                 * @apiParam {json} jsondata   字符串，如："{maxsize:1080}" 。 支持传递参数，无参数时，需传递null值;maxsize属性表示图片的最大尺寸
                 */

                case 'pickAndUploadPhoto':
                    return {
                        actionName: 'pickAndUploadPhoto',
                        data: data ? data : null
                    };

                /**
                 * @api {get} isSupportWXPaySDK 询问客户端是否支持微信支付
                 * @apiName isSupportWXPaySDK
                 * @apiGroup General
                 * @apiDescription 询问客户端是否支持微信支付
                 *
                 * @apiSuccess {Boolean} true表示支持，false为不支持
                 */

                case 'isSupportWXPaySDK':

                    return {
                        actionName: 'isSupportWXPaySDK'
                    };

                /**
                 * @api {get} openSystemConfig 弹出弹窗，提示用户去开启系统通知
                 * @apiName openSystemConfig
                 * @apiGroup General
                 * @apiDescription 在用户在乐乎市集产生了新订单，下单并付款完成后弹出
                 */

                case 'openSystemConfig':

                    return {
                        actionName: 'openSystemConfig'
                    };

                /**
                 * @api {post} setLofterBackUrl 设置路径回调
                 * @apiName setLofterBackUrl
                 * @apiGroup General
                 * @apiDescription 设置路径回调
                 * @apiParam {String} url 页面url字符串
                 */

                case 'setLofterBackUrl':
                    var backUrl = data.url ? data.url : 'https://www.lofter.com/market/fe/home/homePage.html';
                    return {
                        actionName: 'setLofterBackUrl',
                        data: backUrl
                    };
                /**
                 * @api {post} njb_setPageTitle 修改页面title
                 * @apiName njb_setPageTitle
                 * @apiGroup General
                 * @apiDescription 修改页面title
                 * @apiParam {String} title 页面title字符串
                 */

                case 'njb_setPageTitle':
                    var title = data ? data : { title: '乐乎市集' };
                    return {
                        actionName: 'njb_setPageTitle',
                        data: title
                    };

                /**
                 * @api {get} refreshMainPageWhenClose 标识关闭当前webview时刷新乐乎市集tab首页
                 * @apiName refreshMainPageWhenClose
                 * @apiGroup General
                 * @apiDescription 前端调这个接口的时候，客户端记一个标志，标识关闭当前webview时刷新乐乎市集tab首页，不做实时刷新了
                 */

                case 'refreshMainPageWhenClose':

                    return {
                        actionName: 'refreshMainPageWhenClose'

                        /**
                         * @api {post} triggerLofterPaySDK 唤起支付
                         * @apiName triggerLofterPaySDK
                         * @apiGroup General
                         * @apiDescription 唤起支付
                         * @apiParam {Number} type 参数type=0为支付宝支付，type=1为微信支付，type=2为IAP（苹果应用内支付）。当type=0时，params为要传递给支付宝的参数(字符串)
                         */

                    };case 'triggerLofterPaySDK':
                    return {
                        actionName: 'triggerLofterPaySDK',
                        data: data ? data : {}
                    };

                /**
                 * @api {post} updateCurrentUrl 通知APP更新页面URL
                 * @apiName updateCurrentUrl
                 * @apiGroup General
                 * @apiDescription 通知APP更新页面URL
                 * @apiParam {String} url 页面url字符串
                 */

                case 'updateCurrentUrl':
                    var currentUrl = data.url ? data.url : 'https://www.lofter.com/market/fe/home/homePage.html';
                    return {
                        actionName: 'updateCurrentUrl',
                        data: currentUrl
                    };

                /**
                 * @api {post} njb_login 唤起登录
                 * @apiName njb_login
                 * @apiGroup v8
                 * @apiDescription 唤起登录
                 * @apiParam {Function} callback 登录后的回调
                 */

                case 'njb_login':
                    return {
                        actionName: 'njb_login',
                        data: { callback: data.callback }
                    };

                /**
                 * @api {get} njb_updateClient 更新客户端或跳转应用商店
                 * @apiName njb_updateClient
                 * @apiGroup v7
                 * @apiDescription 更新客户端或跳转应用商店
                 */

                case 'njb_updateClient':
                    return {
                        actionName: 'njb_updateClient'
                    };

                /**
                 * @api {get} njb_closeCurrentWebview 关闭当前webview
                 * @apiName njb_closeCurrentWebview
                 * @apiGroup v7
                 * @apiDescription 关闭当前webview
                 */

                case 'njb_closeCurrentWebview':
                    return {
                        actionName: 'njb_closeCurrentWebview'
                    };

                /**
                 * @api {post} njb_share 主动分享并设置该次调用的分享参数
                 * @apiName njb_share
                 * @apiGroup v7
                 * @apiDescription 主动分享并设置该次调用的分享参数
                 * @apiParam {Object} shareCnt   需要分享的内容，具体参数同saveShareContent
                 */

                case 'njb_share':
                    return {
                        actionName: 'njb_share',
                        data: data ? data : {}
                    };

                /**
                 * @api {get} njb_getAppLog 获取客户端日志的nos链接
                 * @apiName njb_getAppLog
                 * @apiGroup v7
                 * @apiDescription 获取客户端日志的nos链接
                 */

                case 'njb_getAppLog':
                    return {
                        actionName: 'njb_getAppLog'
                    };

                /**
                 * @api {POST} njb_providePullDownRefresh 提供下拉刷新
                 * @apiName njb_providePullDownRefresh
                 * @apiGroup v7
                 * @apiDescription 提供下拉刷新
                 * @apiParam {Boolean} provide 是否提供下拉刷新
                 */

                case 'njb_providePullDownRefresh':
                    return {
                        actionName: 'njb_providePullDownRefresh',
                        data: data ? data.provide : false
                    };

                /**
                 * @api {post} njb_reportLogToApp 主动通过app上报web日志
                 * @apiName njb_reportLogToApp
                 * @apiGroup v10
                 * @apiDescription 主动通过app上报web日志
                 * @apiParam {Object}         logContent   需要上报的内容
                 * @apiParam (logContent)       {String}   page         页面或者应用标识
                 * @apiParam (logContent)       {String}   timing       时机(比如请求发起、页面加载完成等时候，优先使用performance api中的定义字段)
                 * @apiParam (logContent)       {String}   log         具体信息
                 */

                case 'njb_reportLogToApp':
                    var logContent = '[' + (data.page ? data.page : location.href) + '] ' + (data.timing || '') + ': ' + (data.log || 'no log info.');
                    return {
                        actionName: 'njb_reportLogToApp',
                        data: logContent
                    };

                case 'pageRedirect':

                    return {
                        data: getPageRedirectData(data)
                    };
            }
        }
    }]);
    return APILofter;
}(APIAbstract);

var nejCallHandler = function nejCallHandler(actionName, data, callback) {
    callHandler$1(APILofter, actionName, data, callback);
};

/**
 * NEJSBridge 统一入口封装
 * js调客户端接口
 */
var callHandler$$1 = function callHandler$$1(_actionName, _data, _callback) {
    var ua = navigator.userAgent.toLowerCase();
    var isAOS = ua.indexOf("android") > -1;
    var isIOS = ua.indexOf("iphone") > -1;

    try {
        switch (_actionName) {
            case 'showActionMenu':
                pageShowActions.actionMenu = function () {
                    callHandler$$1('showActionMenu');
                };
                break;
            case 'hideActionMenu':
                pageShowActions.actionMenu = function () {
                    callHandler$$1('hideActionMenu');
                };
                break;
            case 'saveShareContent':
                pageShowActions.saveShareContent = function () {
                    callHandler$$1('saveShareContent', _data);
                };
                break;
        }
    } catch (e) {}

    try {
        _callback = _callback || function () {};
        //新接口一定为NEJSBridge接口，前缀统一为njb_
        if (_actionName.indexOf('njb_') == 0) {
            // 站内callHandler 不会对原始数据做处理，getLegacyProtocolConfig不会生效，可以在这里进行预处理
            switch (_actionName) {
                case 'njb_reportLogToApp':
                    var logContent = '[' + (_data.page ? _data.page : location.href) + '] ' + (_data.timing || '') + ': ' + (_data.log || 'no log info.');
                    _data = {
                        logContent: logContent
                    };
                    break;
            }
            //新接口
            nejCallHandler(_actionName, _data, _callback);
        } else {
            //老接口
            if (isAOS) {
                //如果是saveShareContent，自动将对象类型的data转化为json string
                if (_actionName === 'saveShareContent' && typeof _data !== 'string') {
                    _data = JSON.stringify(_data);
                }
                //android的老接口不接NEJSBridge
                if (_data !== undefined) {
                    // 安卓区分有无参数
                    window.ViewControllerPush[_actionName](_data);
                } else {
                    window.ViewControllerPush[_actionName]();
                }
            } else if (isIOS) {
                //ios新版本（Lofter-iPhone 6.2.0）开始的老接口也接了NEJSBridge
                if (ua.indexOf('nejsbridge') > -1) {
                    //NEJSBridge 方式
                    nejCallHandler(_actionName, _data, _callback);
                } else {
                    //老的ios jsbridge方式
                    jbCallHandler4Ios(_actionName, _data, _callback);
                }
            }
        }
    } catch (e) {}
};

/**
 * NEJSBridge 统一入口封装
 * 注册js接口，供客户端调用
 */
var registerHandler$$1 = function registerHandler$$1(_actionName, _callback) {
    var ua = navigator.userAgent.toLowerCase();
    var isAOS = ua.indexOf("android") > -1;
    var isIOS = ua.indexOf("iphone") > -1;
    try {
        _callback = _callback || function () {};
        //新接口一定为NEJSBridge接口，前缀统一为njb_
        if (_actionName.indexOf('njb_') == 0) {
            //新接口
            registerHandler$1(_actionName, _callback);
        } else {
            //老接口
            if (isAOS) {
                //android的老接口不接NEJSBridge
                switch (_actionName) {
                    case 'cbImgUploaded':
                        if (!window.loft || !window.loft.app || !window.loft.app.g) {
                            window.loft = {
                                app: {
                                    g: {}
                                }
                            };
                        }
                        window.loft.app.g[_actionName] = function (resp) {
                            // 统一参数返回形式,字符串
                            _callback.call(this, JSON.stringify(resp));
                        };
                        break;
                    default:
                        window[_actionName] = _callback;
                }
            } else if (isIOS) {
                //ios新版本（Lofter-iPhone 6.2.0）开始的老接口也接了NEJSBridge
                if (ua.indexOf('nejsbridge') >= 0) {
                    //NEJSBridge 方式，老的接口走独立的注册方式
                    registerHandler4OldLofter(_actionName, _callback);
                } else {
                    //老的ios jsbridge方式
                    jbRegisterHandler4Ios(_actionName, _callback);
                }
            }
        }
    } catch (e) {}
};




/***/ }),

/***/ 7874:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ module_b)
});

// EXTERNAL MODULE: ./node_modules/nejsbridge/dist/bridge.lofter.es.js
var bridge_lofter_es = __webpack_require__(3999);
;// CONCATENATED MODULE: ./node_modules/nw-detect/es/index.js

var USER_AGENT = navigator.userAgent;
function isWeixin() {
  return /micromessenger/i.test(USER_AGENT);
}
function isYixin() {
  return /yixin/i.test(USER_AGENT);
}
function isComicApp() {
  return USER_AGENT.indexOf('NeteaseComic') != -1;
}
function isXiaomi() {
  return /XiaoMi/i.test(USER_AGENT);
}
function isiPad() {
  return USER_AGENT.indexOf('iPad') > -1;
}
function isYueduApp() {
  return USER_AGENT.indexOf('PRIS') != -1;
}
function isSnail() {
  return /NeteaseSnailReader/i.test(USER_AGENT);
}
function isMusic() {
  return /NeteaseMusic\/([\d\.]+)\b/i.test(USER_AGENT);
}
function isLofter() {
  return /lofter/i.test(USER_AGENT);
}
function ios() {
  return /iPad|iPhone|iPod/.test(USER_AGENT) && !window.MSStream;
}
function isIos() {
  return ios()
}
function isApp() {
  return isLofter() || isYueduApp() || isComicApp() || isSnail() || isMusic();
}
function isQQ() {
  return USER_AGENT.indexOf('QQ/') !== -1;
}
function isUpIos9() {
  return ios() && /OS [9|10|11|12|13]/i.test(USER_AGENT);
}
function isUpIos11() {
  return ios() && /OS [11|12|13]/i.test(USER_AGENT);
}
function isWeibo() {
  return /weibo/i.test(USER_AGENT);
}
function isAndroid() {
  return USER_AGENT.indexOf('Android') > -1 || USER_AGENT.indexOf('Adr') > -1;
}
var WEBP_STORE_KEY = 'IS_SUPPORT_WEBP';
/**
 * 2022-03-25 优化本方法，优先读取localStorage中储存的特性检测结果，同时保证结果返回是同步的
 * 如果无储存结果，异步去计算webp支持情况并更新localStorage
 * @returns boolean 当前浏览器环境是否支持webp
 */

function isSupportWebp() {
  var storeSupport = localStorage.getItem(WEBP_STORE_KEY); // 只要有localStorage的值，就直接返回

  if (storeSupport) {
    return storeSupport === 'true';
  } // 如果没有localStorage的值，执行计算并把结果更新到localStorage


  checkWebpSupport().then(function (res) {
    localStorage.setItem(WEBP_STORE_KEY, res);
  });
  var canvasTestResult = document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;

  if (canvasTestResult) {
    // 只有canvas导出检测为true时才更新localstorage
    localStorage.setItem(WEBP_STORE_KEY, 'true');
  }

  return canvasTestResult;
}

var scopeAwaiter = window && window.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var scopeGenerator = window && window.__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

function checkWebpSupport() {
  return scopeAwaiter(this, void 0, void 0, function () {
    var testImageSources, testImage, results;
    return scopeGenerator(this, function (_a) {
      switch (_a.label) {
        case 0:
          testImageSources = ["data:image/webp;base64,UklGRjIAAABXRUJQVlA4ICYAAACyAgCdASoCAAEALmk0mk0iIiIiIgBoSygABc6zbAAA/v56QAAAAA==", "data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA="];

          testImage = function testImage(src) {
            return new Promise(function (resolve, reject) {
              var img = document.createElement("img");

              img.onerror = function (error) {
                return resolve(false);
              };

              img.onload = function () {
                return resolve(true);
              };

              img.src = src;
            });
          };

          return [4
          /*yield*/
          , Promise.all(testImageSources.map(testImage))];

        case 1:
          results = _a.sent();
          return [2
          /*return*/
          , results.every(function (result) {
            return !!result;
          })];
      }
    });
  });
}

function isSupportWebpAsync() {
  return new Promise(function (resolve) {
    var storeSupport = localStorage.getItem(WEBP_STORE_KEY);

    if (storeSupport === 'true') {
      resolve(true);
    } else {
      checkWebpSupport().then(function (res) {
        localStorage.setItem(WEBP_STORE_KEY, res);
        resolve(res);
      });
    }
  });
}
/**
 * 异步返回，通过JSBridge等方式，严格的检查当前H5运行环境是否为Lofter App内
 * Promise的返回值为number类型，只可能为 0 | 1 | 2这三个值之一
 * 如果当前不在客户端内，resolve 0
 * 如果当前在客户端内，并且版本高于6.8.2，resolve 1
 * 如果当前在客户端版本内，但是版本低于6.8.2，resolve 2
 * @param options
 * @param options.isDev 是否为开发环境，默认为false，传入true则表示当前为开发环境，Promise会resolve 1
 * @returns Promise<0|1|2>
 * */

function isInLofter() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    isDev: false
  };
  var isDev = options.isDev || false;
  return new Promise(function (resolve) {
    if (isDev) {
      resolve(1);
      return;
    }

    if (!isLofter()) {
      resolve(0);
      return;
    } // 如果1000内没有检查出App内的特征，resolve false


    var resolveTimer = setTimeout(function () {
      resolve(0);
    }, 1500);

    var clearTimer = function clearTimer() {
      if (resolveTimer) {
        clearTimeout(resolveTimer);
        resolveTimer = null;
      }
    };

    if (support('njb_getDeviceInfo')) {
      callHandler('njb_getDeviceInfo', function () {
        clearTimer();
        resolve(1);
      });
    } else {
      resolve(2);
    }
  });
}
/**
 * 通过UA获取lofter端内的版本号
 * @returns {string} version 版本号，如'6.12.0'
 */

function getLofterVersion() {
  var version = '';

  if (isLofter()) {
    var regResult = '';

    if (isAndroid()) {
      // Mozilla/5.0 (Linux; Android 8.0.0; MI 6 Build/OPR1.170623.027; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/71.0.3578.99 Mobile Safari/537.36 lofter-android 207  lofter-version 6.11.0 NEJSBridge/8
      regResult = USER_AGENT.match(/lofter-version (\d[.\d]+)/i);
    } else {
      // Mozilla/5.0 (iPhone; CPU iPhone OS 14_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 LOFTER-iPhone 6.11.0 (iPhone; iOS 14.2; zh_CN) WIFI NEJSBridge/10 /hubbledata-sdk-ios
      regResult = USER_AGENT.match(/LOFTER-iPhone (\d[.\d]+)/i);
    }

    if (regResult) {
      version = regResult[1];
    }
  }

  return version;
}
/**
 * 通过UA获取蜗牛端内的版本号
 * @returns {string} version 版本号，如'6.12.0'
 */

function getSnailVersion() {
  var version = '';

  if (isSnail()) {
    var regResult = USER_AGENT.match(/NeteaseSnailReader[^/]*\/(\d[.\d]+).*\((.*);(.*)\)/i);

    if (regResult) {
      version = regResult[1];
    }
  }

  return version;
}
/**
 * 格式化版本号，变成可比较大小的数字，7.1.2转换为7010200,7.1.2.1转换为7010201
 * @param {string} version 想要格式化的版本号，格式必须符合 x.x.x或x.x.x.x
 * @returns {number}
 */

var formateVersion = function formateVersion(version) {
  if (!version || typeof version !== 'string') {
    throw new Error('version参数错误');
  }

  var versionArray = version.split('.');
  var versionNumber = 0;

  for (var i = 0; i < 4; i++) {
    var ver = parseInt(versionArray[i] || '0');

    if (typeof ver !== 'number') {
      throw new Error('version版本号错误');
    }

    versionNumber += ver * Math.pow(100, 3 - i);
  }

  return versionNumber;
};
/**
 * 比较2个字符串版本号，返回版本号1-版本号2的结果
 * @param {string} version1 版本号1
 * @param {string} version2 版本号2
 * @returns {number} version1-version2的结果
 */

var compareVersion = function compareVersion(version1, version2) {
  if (!version1 || typeof version1 !== 'string' || version1.split('.').length) {
    throw new Error('version1参数错误');
  }

  if (!version2 || typeof version2 !== 'string' || version2.split('.').length) {
    throw new Error('version2参数错误');
  }

  var currentVersion = formateVersion(version1);
  var targetVersion = formateVersion(version2);
  return currentVersion - targetVersion;
};
/**
 * 判断当前客户端内版本号是否大于等于给定的版本号
 * 支持Lofter和蜗牛客户端
 * @param {string} version 想要比较的版本号，x.x.x或x.x.x.x格式
 * @returns {boolean} 当前版本是否大于等于给定版本
 */

var isUpAppVersion = function isUpAppVersion(_version) {
  if (!_version || typeof _version !== 'string') {
    throw new Error('version参数错误');
  }

  var version = '';

  if (isLofter()) {
    version = getLofterVersion();
  } else if (isSnail()) {
    version = getSnailVersion();
  }

  if (!version) {
    return false;
  }

  var currentVersion = formateVersion(version);
  var targetVersion = formateVersion(_version);
  return currentVersion - targetVersion >= 0;
};
;// CONCATENATED MODULE: ./src/module-b.js


/* harmony default export */ function module_b(url) {
  if (isSupportWebp()) {
    return url + '?imageView&type=webp';
  }
  return url;
}

/***/ })

}]);