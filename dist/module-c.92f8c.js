(self["webpackChunkwebpack_demo"] = self["webpackChunkwebpack_demo"] || []).push([["module-c"],{

/***/ 9669:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* unused reexport */ __webpack_require__(1609);

/***/ }),

/***/ 5448:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var settle = __webpack_require__(6026);
var cookies = __webpack_require__(4372);
var buildURL = __webpack_require__(5327);
var buildFullPath = __webpack_require__(4097);
var parseHeaders = __webpack_require__(4109);
var isURLSameOrigin = __webpack_require__(7985);
var createError = __webpack_require__(5061);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;
    var responseType = config.responseType;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    function onloadend() {
      if (!request) {
        return;
      }
      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !responseType || responseType === 'text' ||  responseType === 'json' ?
        request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    }

    if ('onloadend' in request) {
      // Use onloadend if available
      request.onloadend = onloadend;
    } else {
      // Listen for ready state to emulate onloadend
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }

        // The request errored out and we didn't get a response, this will be
        // handled by onerror instead
        // With one exception: request that using file: protocol, most browsers
        // will return status as 0 even though it's a successful request
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
          return;
        }
        // readystate handler is calling before onerror or ontimeout handlers,
        // so we should call onloadend on the next 'tick'
        setTimeout(onloadend);
      };
    }

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(
        timeoutErrorMessage,
        config,
        config.transitional && config.transitional.clarifyTimeoutError ? 'ETIMEDOUT' : 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (responseType && responseType !== 'json') {
      request.responseType = config.responseType;
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (!requestData) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ 1609:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var bind = __webpack_require__(1849);
var Axios = __webpack_require__(321);
var mergeConfig = __webpack_require__(7185);
var defaults = __webpack_require__(5655);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(5263);
axios.CancelToken = __webpack_require__(4972);
axios.isCancel = __webpack_require__(6502);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(8713);

// Expose isAxiosError
axios.isAxiosError = __webpack_require__(6268);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports["default"] = axios;


/***/ }),

/***/ 5263:
/***/ ((module) => {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ 4972:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var Cancel = __webpack_require__(5263);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ 6502:
/***/ ((module) => {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ 321:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var buildURL = __webpack_require__(5327);
var InterceptorManager = __webpack_require__(782);
var dispatchRequest = __webpack_require__(3572);
var mergeConfig = __webpack_require__(7185);
var validator = __webpack_require__(4875);

var validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  var transitional = config.transitional;

  if (transitional !== undefined) {
    validator.assertOptions(transitional, {
      silentJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      forcedJSONParsing: validators.transitional(validators.boolean, '1.0.0'),
      clarifyTimeoutError: validators.transitional(validators.boolean, '1.0.0')
    }, false);
  }

  // filter out skipped interceptors
  var requestInterceptorChain = [];
  var synchronousRequestInterceptors = true;
  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    if (typeof interceptor.runWhen === 'function' && interceptor.runWhen(config) === false) {
      return;
    }

    synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;

    requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  var responseInterceptorChain = [];
  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
  });

  var promise;

  if (!synchronousRequestInterceptors) {
    var chain = [dispatchRequest, undefined];

    Array.prototype.unshift.apply(chain, requestInterceptorChain);
    chain = chain.concat(responseInterceptorChain);

    promise = Promise.resolve(config);
    while (chain.length) {
      promise = promise.then(chain.shift(), chain.shift());
    }

    return promise;
  }


  var newConfig = config;
  while (requestInterceptorChain.length) {
    var onFulfilled = requestInterceptorChain.shift();
    var onRejected = requestInterceptorChain.shift();
    try {
      newConfig = onFulfilled(newConfig);
    } catch (error) {
      onRejected(error);
      break;
    }
  }

  try {
    promise = dispatchRequest(newConfig);
  } catch (error) {
    return Promise.reject(error);
  }

  while (responseInterceptorChain.length) {
    promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: (config || {}).data
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(mergeConfig(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ 782:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected, options) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected,
    synchronous: options ? options.synchronous : false,
    runWhen: options ? options.runWhen : null
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ 4097:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isAbsoluteURL = __webpack_require__(1793);
var combineURLs = __webpack_require__(7303);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),

/***/ 5061:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var enhanceError = __webpack_require__(481);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ 3572:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var transformData = __webpack_require__(8527);
var isCancel = __webpack_require__(6502);
var defaults = __webpack_require__(5655);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData.call(
    config,
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData.call(
      config,
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config,
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ 481:
/***/ ((module) => {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),

/***/ 7185:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
  var defaultToConfig2Keys = [
    'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
    'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
  ];
  var directMergeKeys = ['validateStatus'];

  function getMergedValue(target, source) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge(target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }

  function mergeDeepProperties(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  }

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (!utils.isUndefined(config2[prop])) {
      config[prop] = getMergedValue(undefined, config2[prop]);
    } else if (!utils.isUndefined(config1[prop])) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  utils.forEach(directMergeKeys, function merge(prop) {
    if (prop in config2) {
      config[prop] = getMergedValue(config1[prop], config2[prop]);
    } else if (prop in config1) {
      config[prop] = getMergedValue(undefined, config1[prop]);
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys)
    .concat(directMergeKeys);

  var otherKeys = Object
    .keys(config1)
    .concat(Object.keys(config2))
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, mergeDeepProperties);

  return config;
};


/***/ }),

/***/ 6026:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var createError = __webpack_require__(5061);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ 8527:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var defaults = __webpack_require__(5655);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  var context = this || defaults;
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn.call(context, data, headers);
  });

  return data;
};


/***/ }),

/***/ 5655:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);
var normalizeHeaderName = __webpack_require__(6016);
var enhanceError = __webpack_require__(481);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(5448);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(5448);
  }
  return adapter;
}

function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== 'SyntaxError') {
        throw e;
      }
    }
  }

  return (encoder || JSON.stringify)(rawValue);
}

var defaults = {

  transitional: {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  },

  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');

    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data) || (headers && headers['Content-Type'] === 'application/json')) {
      setContentTypeIfUnset(headers, 'application/json');
      return stringifySafely(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    var transitional = this.transitional;
    var silentJSONParsing = transitional && transitional.silentJSONParsing;
    var forcedJSONParsing = transitional && transitional.forcedJSONParsing;
    var strictJSONParsing = !silentJSONParsing && this.responseType === 'json';

    if (strictJSONParsing || (forcedJSONParsing && utils.isString(data) && data.length)) {
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === 'SyntaxError') {
            throw enhanceError(e, this, 'E_JSON_PARSE');
          }
          throw e;
        }
      }
    }

    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,
  maxBodyLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;


/***/ }),

/***/ 1849:
/***/ ((module) => {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ 5327:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ 7303:
/***/ ((module) => {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ 4372:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),

/***/ 1793:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ 6268:
/***/ ((module) => {

"use strict";


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */
module.exports = function isAxiosError(payload) {
  return (typeof payload === 'object') && (payload.isAxiosError === true);
};


/***/ }),

/***/ 7985:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),

/***/ 6016:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ 4109:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var utils = __webpack_require__(4867);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ 8713:
/***/ ((module) => {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ 4875:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var pkg = __webpack_require__(8593);

var validators = {};

// eslint-disable-next-line func-names
['object', 'boolean', 'number', 'function', 'string', 'symbol'].forEach(function(type, i) {
  validators[type] = function validator(thing) {
    return typeof thing === type || 'a' + (i < 1 ? 'n ' : ' ') + type;
  };
});

var deprecatedWarnings = {};
var currentVerArr = pkg.version.split('.');

/**
 * Compare package versions
 * @param {string} version
 * @param {string?} thanVersion
 * @returns {boolean}
 */
function isOlderVersion(version, thanVersion) {
  var pkgVersionArr = thanVersion ? thanVersion.split('.') : currentVerArr;
  var destVer = version.split('.');
  for (var i = 0; i < 3; i++) {
    if (pkgVersionArr[i] > destVer[i]) {
      return true;
    } else if (pkgVersionArr[i] < destVer[i]) {
      return false;
    }
  }
  return false;
}

/**
 * Transitional option validator
 * @param {function|boolean?} validator
 * @param {string?} version
 * @param {string} message
 * @returns {function}
 */
validators.transitional = function transitional(validator, version, message) {
  var isDeprecated = version && isOlderVersion(version);

  function formatMessage(opt, desc) {
    return '[Axios v' + pkg.version + '] Transitional option \'' + opt + '\'' + desc + (message ? '. ' + message : '');
  }

  // eslint-disable-next-line func-names
  return function(value, opt, opts) {
    if (validator === false) {
      throw new Error(formatMessage(opt, ' has been removed in ' + version));
    }

    if (isDeprecated && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      // eslint-disable-next-line no-console
      console.warn(
        formatMessage(
          opt,
          ' has been deprecated since v' + version + ' and will be removed in the near future'
        )
      );
    }

    return validator ? validator(value, opt, opts) : true;
  };
};

/**
 * Assert object's properties type
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 */

function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== 'object') {
    throw new TypeError('options must be an object');
  }
  var keys = Object.keys(options);
  var i = keys.length;
  while (i-- > 0) {
    var opt = keys[i];
    var validator = schema[opt];
    if (validator) {
      var value = options[opt];
      var result = value === undefined || validator(value, opt, options);
      if (result !== true) {
        throw new TypeError('option ' + opt + ' must be ' + result);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw Error('Unknown option ' + opt);
    }
  }
}

module.exports = {
  isOlderVersion: isOlderVersion,
  assertOptions: assertOptions,
  validators: validators
};


/***/ }),

/***/ 4867:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var bind = __webpack_require__(1849);

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a plain Object
 *
 * @param {Object} val The value to test
 * @return {boolean} True if value is a plain Object, otherwise false
 */
function isPlainObject(val) {
  if (toString.call(val) !== '[object Object]') {
    return false;
  }

  var prototype = Object.getPrototypeOf(val);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (isPlainObject(result[key]) && isPlainObject(val)) {
      result[key] = merge(result[key], val);
    } else if (isPlainObject(val)) {
      result[key] = merge({}, val);
    } else if (isArray(val)) {
      result[key] = val.slice();
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 * @return {string} content value without BOM
 */
function stripBOM(content) {
  if (content.charCodeAt(0) === 0xFEFF) {
    content = content.slice(1);
  }
  return content;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isPlainObject: isPlainObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim,
  stripBOM: stripBOM
};


/***/ }),

/***/ 4526:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "B": () => (/* binding */ share)
});

// UNUSED EXPORTS: setOrUpdate

// EXTERNAL MODULE: ./node_modules/nejsbridge/dist/bridge.lofter.es.js
var bridge_lofter_es = __webpack_require__(3999);
;// CONCATENATED MODULE: ./node_modules/nw-share/node_modules/nw-detect/es/index.js

var USER_AGENT = navigator.userAgent;
function es_isWeixin() {
  return /micromessenger/i.test(USER_AGENT);
}
function es_isYixin() {
  return /yixin/i.test(USER_AGENT);
}
function es_isComicApp() {
  return USER_AGENT.indexOf('NeteaseComic') != -1;
}
function isXiaomi() {
  return /XiaoMi/i.test(USER_AGENT);
}
function isiPad() {
  return USER_AGENT.indexOf('iPad') > -1;
}
function es_isYueduApp() {
  return USER_AGENT.indexOf('PRIS') != -1;
}
function es_isSnail() {
  return /NeteaseSnailReader/i.test(USER_AGENT);
}
function es_isMusic() {
  return /NeteaseMusic\/([\d\.]+)\b/i.test(USER_AGENT);
}
function es_isLofter() {
  return /lofter/i.test(USER_AGENT);
}
function ios() {
  return /iPad|iPhone|iPod/.test(USER_AGENT) && !window.MSStream;
}
function isIos() {
  return ios()
}
function isApp() {
  return es_isLofter() || es_isYueduApp() || es_isComicApp() || es_isSnail() || es_isMusic();
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

    if (!es_isLofter()) {
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

  if (es_isLofter()) {
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

  if (es_isSnail()) {
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

var es_compareVersion = function compareVersion(version1, version2) {
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

  if (es_isLofter()) {
    version = getLofterVersion();
  } else if (es_isSnail()) {
    version = getSnailVersion();
  }

  if (!version) {
    return false;
  }

  var currentVersion = formateVersion(version);
  var targetVersion = formateVersion(_version);
  return currentVersion - targetVersion >= 0;
};
;// CONCATENATED MODULE: ./node_modules/nejsbridge/dist/bridge.es.js
var bridgeCallbackQueue = [];

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

var callHandler$1 = function callHandler(actionName, data, callback) {
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

var registerHandler = function registerHandler(actionName, callback) {
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

var callHandler$2 = function callHandler(actionName, data, callback, isInApp) {
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

var callHandler$$1 = isJsbridgeCapable ? callHandler$1 : callHandler$2;

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

        callHandler$$1(path, data.query, oCallback, isInApp, seperator);
    } else {
        var _path = APIInstance.getComputedUrl(actionName);

        callHandler$$1(_path, data, oCallback, isInApp, seperator);
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

    callHandler$$1(actionName, data, callback);
};

var doCallHandler = isJsbridgeCapable ? jsbridgeCallHandler : schemaCallHandler;

var callHandler$4 = function callHandler$$2(API, actionName) {
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
var bridge_es_hasOwnProperty = Object.prototype.hasOwnProperty;
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

var bridge_es_objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (bridge_es_hasOwnProperty.call(from, key)) {
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
    openLoginView: 2,
    savePictureAndShare: 3,
    openImagePickerDialog: 4,
    hideHeader: 5,
    changeDocumentTitle: 5,
    shareSuccess: 5,
    sharePanelOpen: 5,
    getGender: 6
};

var bridge_es_support = function support(actionName) {
    return libSupport(actionName, map);
};

var getAppVersion = function getAppVersion() {
    var userAgent = navigator.userAgent;

    if (!userAgent.match(/(iPhone|iPad)/) && !userAgent.match(/Android/)) {
        return false;
    }

    var clientVersionPatternArray = userAgent.match(/\bNeteaseComic\/([.0-9]+)\b/);

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

        /**
         * @api {get} topic 话题
         * @apiName topic
         * @apiDescription 话题
         * @apiGroup PageNavagation
         * @apiDeprecated use now (#General:pageRedirect).
         * @apiPermission jsbridge & schema
         *
         * @apiParam {String} id 话题
         */
        case 'topic':
            action = 7;
            a = 9;
            newSchemaQuery.id = data.query.id;
            defaultQuery.id = data.query.id;

            break;

        /**
        * @api {get} detail 漫画详情
        * @apiName detail
        * @apiDescription 漫画详情
        * @apiGroup PageNavagation
        * @apiDeprecated use now (#General:pageRedirect).
        * @apiPermission jsbridge & schema
        *
        * @apiParam {String} id 漫画id
        */

        case 'detail':
            action = 4;
            a = 3;
            newSchemaQuery.id = data.query.id;
            defaultQuery.id = data.query.id;

            break;

        /**
        * @api {get} reader 漫画阅读器
        * @apiName reader
        * @apiDescription 漫画阅读器，2.4.0协议之前跳转详情页面
        * @apiGroup PageNavagation
        * @apiDeprecated use now (#General:pageRedirect).
        * @apiPermission jsbridge & schema
        *
        * @apiParam {String} id 漫画id
        * @apiParam {String} [sectionId] 漫画话ID
        */

        case 'reader':
            action = 5;
            a = 3;
            newSchemaQuery.id = data.query.id;
            defaultQuery.id = data.query.id;

            if (data.query.sectionId) {
                defaultQuery.sectionId = data.query.sectionId;
            }

            break;

        /**
        * @api {get} bookListSubject 漫画列表专题页面
        * @apiName bookListSubject
        * @apiDescription 漫画列表专题页面
        * @apiGroup PageNavagation
        * @apiDeprecated use now (#General:pageRedirect).
        * @apiPermission jsbridge & schema
        *
        * @apiParam {String} id 漫画列表专题ID
        */

        case 'bookListSubject':
            action = 22;
            a = 4;
            newSchemaQuery.id = data.query.id;
            defaultQuery.id = data.query.id;

            break;

        /**
        * @api {get} topLevelPage 一级页面
        * @apiName topLevelPage
        * @apiDescription 2.4.0之前没有此协议，iOS不支持bridge方式调用
        * @apiGroup PageNavagation
        * @apiDeprecated use now (#General:pageRedirect).
        * @apiPermission jsbridge & schema
        *
        * @apiParam {Number} index 0-推荐漫画，1-找漫画，2-我的漫画，5-话题列表页，4-账号页
        */

        case 'topLevelPage':
            action = 3;
            newSchemaQuery.index = data.query.index;

            break;

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

function getShareContent(platform, fromnative) {
    callHandler$3('share', {
        platform: platform,
        fromnative: fromnative ? 'true' : 'false'
    });
}

var setupShareSupport = function setupShareSupport() {
    window.getShareContent = getShareContent;
};

var APIComic = function (_APIAbstract) {
    inherits(APIComic, _APIAbstract);

    function APIComic() {
        classCallCheck(this, APIComic);

        var _this = possibleConstructorReturn(this, (APIComic.__proto__ || Object.getPrototypeOf(APIComic)).call(this));

        _this.schemaName_ = 'neteasecomic';
        return _this;
    }

    createClass(APIComic, [{
        key: 'isInApp',
        value: function isInApp() {
            return navigator.userAgent.indexOf('NeteaseComic') !== -1;
        }
    }, {
        key: 'getLegacyProtocolConfig',
        value: function getLegacyProtocolConfig(actionName, data) {
            switch (actionName) {

                /**
                * @api {post} share 唤起客户端分享模块
                * @apiName share
                * @apiGroup General
                * @apiDescription 唤起客户端分享模块，comic直接分享对应的平台
                *
                * @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(仅限snail)
                * @apiParam {String} description 分享内容的描述
                * @apiParam {String} picurl 分享的缩略图url
                * @apiParam {String} link 分享内容的跳转url
                * @apiParam {String} [activity] 设置当前页的活动代号，用于特定活动的统计需求
                * @apiParam (comic) {String} [text] 分享到微博的文字内容
                * @apiParam (comic) {String} [platform] 分享平台
                * @apiParam (comic) {String} [panel_title] 分享框的文案，默认文案是分享给朋友
                * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                *
                * @apiSuccess {Boolean} success 成功还是失败
                */
                case 'share':

                    data = bridge_es_objectAssign({}, this.shareConfig_, data);

                    data = bridge_es_objectAssign({}, {
                        link: data.link,
                        picurl: data.picurl,
                        platform: data.platform,
                        subtitle: data.description,
                        title: data.title,
                        text: data.text || data.description
                    });

                    if (typeof data.fromnative === 'undefined') {
                        data.fromnative = 'false';
                    }

                    return {
                        actionName: 'share/content',
                        data: data,
                        callback: 'sendShareResult'
                    };
                    break;

                /**
                * @api {post} setShareConfig 设置webview当前页面的分享参数
                * @apiName setShareConfig
                * @apiGroup General
                * @apiDescription 设置webview当前页面的分享参数
                *
                * @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(仅限snail)
                * @apiParam {String} description 分享内容的描述
                * @apiParam {String} picurl 分享的缩略图url
                * @apiParam {String} link 分享内容的跳转url
                * @apiParam (comic) {String} [text] 分享到微博的文字内容
                * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                *
                */

                case 'setShareConfig':

                    // cache share config
                    this.shareConfig_ = bridge_es_objectAssign({}, data);
                    setupShareSupport();

                    return {
                        actionName: 'share/support'
                    };
                    break;

                /**
                * @api {get} appInstallCheck 通知客户端检测是否安装了应用
                * @apiName appInstallCheck
                * @apiDescription 安卓独有，JS通知客户端检测是否已经安装微信/支付宝/QQ
                * @apiGroup Util
                * @apiPermission jsbridge
                *
                * @apiParam {String} app_type 应用类型 50: 支付宝, 51: 微信, 55:QQ
                *
                * @apiSuccess {String} app_type 应用类型
                * @apiSuccess {Number} installed 安装结果 1: 已安装, 0:未安装
                */

                case 'appInstallCheck':

                    return {
                        callback: {
                            name: 'notify_app_installed',
                            handler: function handler(app_type, installed) {
                                return {
                                    app_type: app_type,
                                    installed: installed
                                };
                            }
                        }
                    };

                    break;

                /**
                * @api {post} rechargeContent 充值
                * @apiName rechargeContent
                * @apiDescription 安卓独有，JS通知客户端构造好的订单数据
                * @apiGroup Trade
                * @apiPermission jsbridge
                *
                * @apiParam {String} recharge_param SDK调用所需要的参数,可以直接拿来用
                * @apiParam {Number} pay_type 应用类型 50: 支付宝, 51: 微信, 55:QQ
                * @apiParam {String} callback_param app回调js时需要附加传入的内容
                *
                * @apiSuccess {Number} client_type 客户端类型: 0:WEB, 1:ANDROID, 2:IPAD, 3:IPHONE, 4:WINDOWS, 5:WAP
                * @apiSuccess {Number} pay_type 支付方式: 50:支付宝, 51:微信,55:QQ
                * @apiSuccess {String} callback_param JS通知客户端构造好的callback_param
                *
                * @apiError rechargeContentFailed 充值失败
                *
                * @apiErrorExample Error-Response:
                *     {code: -1}
                * 
                *
                * @apiError rechargeContentCancelled 用户取消充值
                *
                * @apiErrorExample Error-Response:
                *     {code: -2}
                * 
                */

                case 'rechargeContent':

                    return {
                        callback: {
                            name: 'notify_pay_result',
                            handler: function handler(client_type, pay_type, callback_param) {
                                return {
                                    client_type: client_type,
                                    pay_type: pay_type,
                                    callback_param: callback_param
                                };
                            }
                        }
                    };

                    break;

                /**
                 * @api {get} purchaseSuccess 购买成功通知
                 * @apiName purchaseSuccess
                 * @apiDescription 安卓独有，购买成功通知
                * @apiParam {String} type 购买类型 vip=vip coin=金币 vm=钻石
                * @apiGroup Trade
                * @apiPermission jsbridge
                *
                */
                case 'purchaseSuccess':

                    switch (data.type) {
                        case 'vip':
                            return {
                                actionName: '',
                                data: {
                                    vip: 'ok',
                                    client_refresh: '1'
                                }
                            };

                        case 'coin':

                            return {
                                actionName: '',
                                data: {
                                    coin: 'ok'
                                }
                            };
                    }

                    break;

                /**
                * @api {get} refreshVipInfo 刷新vip信息
                * @apiName refreshVipInfo
                * @apiDescription 安卓独有，刷新vip信息
                * @apiGroup Trade
                * @apiPermission jsbridge
                *
                */

                case 'refreshVipInfo':
                    return {
                        actionName: '',
                        data: {
                            vip: 'ok',
                            client_refresh: '1'
                        }
                    };

                    break;

                /**
                 * @api {post} closeCurrentWebview 关闭当前客户端打开的webview
                * @apiName closeCurrentWebview
                * @apiGroup General
                * @apiDescription 关闭当前客户端打开的webview，可用于充值成功页面点击关闭按钮关闭当前webview
                */
                case 'closeCurrentWebview':
                    return {
                        actionName: 'rechargeCloseClick'
                    };

                case 'getLoginUserToken':
                    return {
                        actionName: 'appLogin',
                        callback: {
                            name: 'notify_app_login_success_new',
                            handler: function handler(login_param, client_param) {
                                return {
                                    token: login_param,
                                    clientInfo: client_param
                                };
                            }
                        }

                    };
                    break;

                /**
                * @api {get} openVip 开通vip
                * @apiName openVip
                * @apiDescription iOS独有，开通vip
                * @apiGroup Trade
                * @apiPermission jsbridge
                *
                */
                case 'openVip':

                    return {
                        actionName: 'pageRedirect',
                        data: {
                            path: 'comic/vip'
                        }
                    };
                    break;

                case 'pageRedirect':

                    return {
                        data: getPageRedirectData(data)
                    };
            }
        }
    }]);
    return APIComic;
}(APIAbstract);

var callHandler$3 = function callHandler$$2(actionName, data, callback) {
    callHandler$4(APIComic, actionName, data, callback);
};

var map$1 = {
    share2: 2,
    setShareConfig2: 2,
    shareComplete: 2
};

var support$1 = function support(actionName) {
    return libSupport(actionName, map$1);
};

var APISnail = function (_APIAbstract) {
    inherits(APISnail, _APIAbstract);

    function APISnail() {
        classCallCheck(this, APISnail);

        //add snailJS namespace default callback to prevent ios js bug
        var _this = possibleConstructorReturn(this, (APISnail.__proto__ || Object.getPrototypeOf(APISnail)).call(this));

        window.snailJS = window.snailJS || {
            noticeStatusCallBack: function noticeStatusCallBack() {
                console.log('noticeStatusCallBack');
            },
            purchaseCallBack: function purchaseCallBack() {
                console.log('purchaseCallBack');
            },
            tokenCallBack: function tokenCallBack() {
                console.log('tokenCallBack');
            },
            userInfoCallBack: function userInfoCallBack() {
                console.log('userInfoCallBack');
            }
        };
        _this.schemaName_ = 'nesnailreader';
        return _this;
    }

    createClass(APISnail, [{
        key: 'isInApp',
        value: function isInApp() {
            return (/NeteaseSnailReader/i.test(window.navigator.userAgent)
            );
        }
    }, {
        key: 'getLegacyProtocolConfig',
        value: function getLegacyProtocolConfig(actionName, data) {
            switch (actionName) {

                /**
                 * @api {get} updateClient 跳转到对应的渠道下载最新版app
                 * @apiName updateClient
                 * @apiGroup General
                 */
                case 'updateClient':
                    break;

                /**
                * @api {post} share 唤起客户端分享模块
                * @apiName share
                * @apiGroup General
                * @apiDescription 唤起客户端分享模块，comic直接分享对应的平台
                *
                * @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(仅限snail)
                * @apiParam {String} description 分享内容的描述
                * @apiParam {String} picurl 分享的缩略图url
                * @apiParam {String} link 分享内容的跳转url
                * @apiParam (comic) {String} [text] 分享到微博的文字内容
                * @apiParam (comic) {String} [platform] 分享平台
                * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                *
                * @apiSuccess {Boolean} success 成功还是失败
                */

                case 'share':

                    data = bridge_es_objectAssign({}, {
                        url: data.link,
                        icon: data.picurl,
                        channel: data.channel,
                        description: data.description,
                        title: data.title
                    });

                    return {
                        actionName: 'share',
                        data: {
                            data: JSON.stringify(data)
                        },
                        callback: 'snailJS.shareComplete'

                        /**
                        * @api {post} setShareConfig 设置webview当前页面的分享参数
                        * @apiName setShareConfig
                        * @apiGroup General
                        * @apiDescription 设置webview当前页面的分享参数
                        *
                        * @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(仅限snail)
                        * @apiParam {String} description 分享内容的描述
                        * @apiParam {String} picurl 分享的缩略图url
                        * @apiParam {String} link 分享内容的跳转url
                        * @apiParam {String} [activity] 设置当前页的活动代号，用于特定活动的统计需求
                        * @apiParam (comic) {String} [text] 分享到微博的文字内容
                        * @apiParam (comic) {String} [platform] 分享平台
                        * @apiParam (comic) {String} [panel_title] 分享框的文案，默认文案是分享给朋友
                        * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                        *
                        */

                    };case 'setShareConfig':

                    data = bridge_es_objectAssign({}, {
                        url: data.link,
                        icon: data.picurl,
                        channel: data.channel,
                        description: data.description,
                        title: data.title,
                        activity: data.activity
                    });

                    return {
                        data: {
                            data: JSON.stringify(data)
                        }
                    };

                case 'getLoginUserToken':
                    return {
                        callback: {
                            name: 'snailJS.tokenCallBack',
                            handler: function handler(token) {
                                return {
                                    token: token
                                };
                            }
                        }
                    };

                case 'receiveLoginUserTokenSuccess':
                    break;

                case 'getUserInfo':
                    return {
                        callback: {
                            name: 'snailJS.userInfoCallBack',
                            handler: function handler(json) {
                                return JSON.parse(json);
                            }
                        }
                    };

                /**
                   * @api {post} receiveLoginUserTokenSuccess 成功收到token
                   * @apiDescription 成功收到token
                   * @apiName receiveLoginUserTokenSuccess
                   * @apiGroup General
                   * @apiPermission jsbridge
                   */

                case 'receiveLoginUserTokenSuccess':
                    return {};

                /**
                 * @api {get} purchase 购买
                 * @apiName purchase
                 * @apiGroup Trade
                 * @apiPermission jsbridge
                 *
                 * @apiParam (iOS) {Number} [itunesId] ios商品id，如果不传则打开商品选择页
                 * @apiParam (android) {Number} [goodId] 商品ID，如果不传则打开商品选择页
                 * @apiParam (android) {String} [goodName] 商品名称，随goodId出现
                 * @apiParam (android) {Number} [money] 对应商品的价格，随goodId出现
                 *
                 * @apiSuccess {Boolean} success 成功还是失败
                 *
                 * @apiSuccessExample Success-Response:
                 *     {
                 *       "success": true
                 *     }
                 *
                 * @apiError purchaseCancelled 用户取消购买
                 *
                 * @apiErrorExample Error-Response:
                 *     null
                 */
                case 'purchase':
                    return {
                        callback: 'snailJS.purchaseCallBack'
                    };
            }
        }
    }]);
    return APISnail;
}(APIAbstract);

var callHandler$5 = function callHandler$$2(actionName, data, callback) {
    //新接口兼容老版本
    switch (actionName) {
        case 'share2':
            if (!support$1('share2')) {
                data = bridge_es_objectAssign({}, {
                    url: data.default.url,
                    icon: data.default.image,
                    channel: data.channel || '',
                    description: data.default.description,
                    title: data.default.title,
                    activity: data.activity
                });
                actionName = 'share';
            }
            break;

        case 'setShareConfig2':
            if (!support$1('setShareConfig2')) {
                data = bridge_es_objectAssign({}, {
                    url: data.default.url,
                    icon: data.default.image,
                    channel: data.channel,
                    description: data.default.description,
                    title: data.default.title,
                    activity: data.activity
                });
                actionName = 'setShareConfig';
            }
            break;
    }
    callHandler$4(APISnail, actionName, data, callback);
};

var registerHandler$1 = function registerHandler$$1(actionName, callback) {
    //新接口兼容老版本
    switch (actionName) {
        case 'shareComplete':
            if (!support$1('shareComplete')) {
                window.snailJS = window.snailJS || {};
                snailJS.shareComplete = function (result) {
                    var json = {
                        result: result
                    };
                    callback(json);
                };
                return;
            }
            break;
    }
    registerHandler(actionName, callback);
};

var stringify$1 = function stringify(query) {
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

var classCallCheck$1 = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass$1 = function () {
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

var inherits$1 = function (subClass, superClass) {
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

var possibleConstructorReturn$1 = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var patternResult$1 = navigator.userAgent.match(/NEJSBridge\/([\d.]+)\b/);

var APIAbstract$2 = function () {
    function APIAbstract() {
        classCallCheck$1(this, APIAbstract);
    }

    createClass$1(APIAbstract, [{
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

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols$1 = Object.getOwnPropertySymbols;
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var propIsEnumerable$1 = Object.prototype.propertyIsEnumerable;

function toObject$1(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative$1() {
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

var objectAssign$2 = shouldUseNative$1() ? Object.assign : function (target, source) {
	var from;
	var to = toObject$1(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty$1.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols$1) {
			symbols = getOwnPropertySymbols$1(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable$1.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var getAppVersion$1 = function getAppVersion() {
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

var getShouldUseNewSchema$1 = function getShouldUseNewSchema() {
    var clientVersionObj = getAppVersion$1();

    if (!clientVersionObj) return false;

    if (clientVersionObj.mainVersion > 2 || clientVersionObj.mainVersion === 2 && clientVersionObj.subVersion >= 4) {
        return true;
    }

    return false;
};

var getPageRedirectData$2 = function getPageRedirectData(data) {
    var shouldUseNewSchema = getShouldUseNewSchema$1();

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

    defaultQuery.actionUrl = newSchemaPath + '?' + stringify$1(newSchemaQuery);

    return {
        path: 'shareCallback',
        query: defaultQuery
    };
};



var APILofter = function (_APIAbstract) {
    inherits$1(APILofter, _APIAbstract);

    function APILofter() {
        classCallCheck$1(this, APILofter);

        var _this = possibleConstructorReturn$1(this, (APILofter.__proto__ || Object.getPrototypeOf(APILofter)).call(this));

        _this.schemaName_ = 'neteaselofter';
        return _this;
    }

    createClass$1(APILofter, [{
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
                    break;

                /**
                 * @api {get} showMenu 弹出分享组件
                 * @apiName showMenu
                 * @apiGroup General
                 * @apiDescription 弹出分享组件
                 */

                case 'showMenu':

                    return {
                        actionName: 'showMenu'
                    };
                    break;

                /**
                 * @api {get} hideActionMenu 隐藏当前webview的分享按钮
                 * @apiName hideActionMenu
                 * @apiGroup General
                 * @apiDescription 隐藏当前webview的分享按钮
                 */

                case 'hideActionMenu':

                    return {
                        actionName: 'hideActionMenu'
                    };
                    break;

                /**
                 * @api {post} saveImage 下载图片到系统相册
                 * @apiName saveImage
                 * @apiGroup General
                 * @apiDescription 下载图片到系统相册
                 * @apiParam {Object}  imgdata  "{url:图片链接,data:图片的base64编码}"
                 * @apiParam (imgdata)  url     图片链接;url为空字符串时，启用下一个参数
                 * @apiParam (imgdata)  [data]  图片的base64编码
                 */

                case 'saveImage':
                    return {
                        actionName: 'saveImage',
                        data: data ? data : {}
                    };
                    break;

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
                    break;

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
                    break;

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
                    break;

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
                    break;
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
                    break;

                /**
                 * @api {get} refreshMainPageWhenClose 标识关闭当前webview时刷新乐乎市集tab首页
                 * @apiName refreshMainPageWhenClose
                 * @apiGroup General
                 * @apiDescription 前端调这个接口的时候，客户端记一个标志，标识关闭当前webview时刷新乐乎市集tab首页，不做实时刷新了
                 */

                case 'refreshMainPageWhenClose':

                    return {
                        actionName: 'refreshMainPageWhenClose'
                    };
                    break;

                /**
                 * @api {post} triggerLofterPaySDK 唤起支付
                 * @apiName triggerLofterPaySDK
                 * @apiGroup General
                 * @apiDescription 唤起支付
                 * @apiParam {Number} type 参数type=0为支付宝支付，type=1为微信支付，type=2为IAP（苹果应用内支付）。当type=0时，params为要传递给支付宝的参数(字符串)
                 */

                case 'triggerLofterPaySDK':
                    return {
                        actionName: 'triggerLofterPaySDK',
                        data: data ? data : {}
                    };
                    break;

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
                    break;

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
                    break;

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
                    break;

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
                    break;

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
                    break;

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
                    break;

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
                    break;

                case 'pageRedirect':

                    return {
                        data: getPageRedirectData$2(data)
                    };
            }
        }
    }]);
    return APILofter;
}(APIAbstract$2);

var bridge_es_USER_AGENT = navigator.userAgent;





function bridge_es_isYueduApp() {
  return bridge_es_USER_AGENT.indexOf('PRIS') != -1;
}



function bridge_es_ios() {
  return /iPad|iPhone|iPod/.test(bridge_es_USER_AGENT) && !window.MSStream;
}







/**
 * 异步返回，通过JSBridge等方式，严格的检查当前H5运行环境是否为Lofter App内，只会resolve true或者false，不会reject
 * 如果当前客户端的版本低于682，也会resolve false
 * @param options
 * @param options.isDev 是否为开发环境，默认为false，传入true则表示当前为开发环境，Promise会resolve true
 * @returns Promise<Boolean>
 * */


/**
 * 通过UA获取lofter端内的版本号
 * @returns {string} version 版本号，如'6.12.0'
 */


/**
 * 格式化版本号，变成可比较大小的数字
 * @param {string} version 想要格式化的版本号，格式必须符合 x.x.x
 * @returns {number}
 */


/**
 * 比较2个字符串版本号，返回版本号1-版本号2的结果
 * @param {string} version1 版本号1
 * @param {string} version2 版本号2
 */


/**
 * 判断当前lofter客户端内版本号是否大于等于给定的版本号
 * @param {string} version 想要比较的版本号，x.x.x格式
 */

var compareVersion$1 = function compareVersion(str1, str2) {
  var v1 = str1.split(".");
  var v2 = str2.split(".");
  var l1 = v1.length;
  var l2 = v2.length;

  for (var i = 0; i < Math.max(l1, l2); i++) {
    var k1 = 0;

    if (i < l1) {
      k1 = parseInt(v1[i]);
    }

    var k2 = 0;

    if (i < l2) {
      k2 = parseInt(v2[i]);
    }

    if (k1 != k2) {
      return k1 > k2 ? 1 : -1;
    }
  }

  return 0;
};

var map$3 = {
    shareComplete: 1,
    bindMobileComplete: 1,
    commentClientComplete: 1,
    buyBookCallback: 1,
    buyPackageCallback: 1
};

var NEREADER_ACTION_MAP = {
    'recharge': 1,
    'trade': 2,
    'packagebuy': 3,
    'audio': 4,
    'bookshelf': 5,
    'mobileBind': 6,
    'rank': 7,
    'bookstore': 8,
    'category': 9,
    'package': 10, //包月详情
    "packageBuyList": 11, // 打包购列表页
    "fullSubtract": 12 // 满减专题页面

};

var isInternal = bridge_es_isYueduApp();

var support$2 = function support(actionName) {
    return libSupport(actionName, map$3);
};

var getVersion = function getVersion() {
    var matchArr = navigator.userAgent.match(/PRIS.*?\/([\d.]+)\b/);
    return matchArr ? matchArr[1] : '';
};

var getPageRedirectData$1 = function getPageRedirectData(data) {
    var newSchemaQuery = {};
    var newSchemaPath = data.path;

    if (NEREADER_ACTION_MAP[data.path]) {
        /**
         * @api {get} nereader方式跳转客户端页面
         * @apiName recharge(充值)、trade(购买)、packagebuy(打包购详情)、audio(听书详情)、bookshelf(书架)、mobileBind(手机号绑定页)、
         * rank(排行榜)、bookstore(书城)、category(分类)、package(包月详情)
         * @apiDescription 具体见通信协议定义
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         */
        newSchemaQuery = bridge_es_objectAssign({}, data.query, {
            action: NEREADER_ACTION_MAP[data.path],
            out: ~~!isInternal //out: 1 外部浏览器; 0 内嵌页
        });
        newSchemaPath = 'nereader://yuedu.163.com/v1';
        return {
            path: newSchemaPath,
            query: newSchemaQuery,
            seperator: '?'
        };
    }

    switch (data.path) {
        /**
         * @api {get} getbookdetail/detail 跳转书籍详情页
         * @apiName getbookdetail/detail
         * @apiDescription 兼容getbookdetail和detail两种方式
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} entryid 书籍id，字段也兼容id
         */
        case 'detail':
        case 'getbookdetail':
            newSchemaPath = 'getbookdetail';
            newSchemaQuery.entryid = data.query.entryid || data.query.id;
            if (!isInternal) {
                newSchemaPath = 'neteasereaderuri://';
                newSchemaQuery.type = 2;
            }
            break;

        /**
         * @api {get} webview 跳转首页
         * @apiName webview
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         */
        case 'webview':
            newSchemaPath = 'neteasereaderuri://';
            newSchemaQuery.type = 6;
            break;

        /**
         * @api {get} getarticledetail/news 跳转资讯详情页
         * @apiName getarticledetail/news
         * @apiDescription 兼容getarticledetail和news两种方式
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} entryid 资讯文章id，字段也兼容cid
         */
        case 'news':
        case 'getarticledetail':
            newSchemaQuery.entryid = data.query.entryid || data.query.cid;
            if (isInternal) {
                newSchemaPath = 'getarticledetail';
                newSchemaQuery.url = 'https://easyreadfs.nosdn.127.net/web/trunk/1559008544317/y1.zip';
            } else {
                newSchemaPath = 'neteasereaderuri://';
                newSchemaQuery.type = 0;
                newSchemaQuery.temurl = 'https://easyreadfs.nosdn.127.net/web/trunk/1559008572165/y2.zip';
            }
            var result = [];
            for (var i in newSchemaQuery) {
                if (newSchemaQuery.hasOwnProperty(i)) {
                    result.push(i + '=' + newSchemaQuery[i]);
                }
            }
            newSchemaQuery = result.join('&');
            break;

        /**
         * @api {get} baoyue 跳转包月详情页
         * @apiName baoyue
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} entryid 包月id，字段也兼容id
         */
        case 'baoyue':
            newSchemaPath = 'neteasereaderuri://';
            newSchemaQuery.type = 4;
            newSchemaQuery.entryid = data.query.entryid || data.query.id;
            break;

        /**
         * @api {get} shelf 跳转书架
         * @apiName shelf
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         */
        case 'shelf':
            newSchemaPath = 'neteasereaderuri://';
            newSchemaQuery.type = 7;
            break;

        /**
        * @api {get} activity 打开活动页(任意h5页面)
        * @apiName activity
        * @apiGroup (#General:pageRedirect)
        * @apiParam {String} url h5页面url
        */
        case 'activity':
            newSchemaPath = 'neteasereaderuri://';
            newSchemaQuery.type = 3;
            newSchemaQuery.url = data.query.url;
            break;

        /**
         * @api {get} viewProfile 打开客户端个人主页
         * @apiName viewProfile
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} uid 用户id   （匿名传0）
         * @apiParam {String} nickname 用户昵称 (匿名传评论昵称)
         */
        case 'viewProfile':
        /**
         * @api {get} getchat 登录状态下发送私信
         * @apiName getchat
         * @apiDescription 在登录状态下，官网传递发送私信请求给客户端，调起私信，同时，传递反馈分类标签
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} userId 阅读小知的id
         * @apiParam {String} nickname 阅读小知的昵称
         * @apiParam {String} tag 反馈所属类别
         */
        case 'getchat':
        /**
         * @api {get} gotofeedback 未登录状态下调起反馈意见页面
         * @apiName gotofeedback
         * @apiDescription 在游客情况下使用，发送私信请求给客户端，调起反馈意见页面
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         *
         * @apiParam {String} userId 阅读小知的id
         * @apiParam {String} nickname 阅读小知的昵称
         * @apiParam {String} tag 反馈所属类别
         */
        case 'gotofeedback':
            newSchemaQuery = {
                data: JSON.stringify(data.query)
            };
            break;

        /**
         * @api {get} gethtmlclick 升级客户端或者用于客户端内跳转
         * @apiName gethtmlclick
         * @apiDescription 1. 升级客户端web:gethtmlclick;encodeURIComponent('http://yuedu.163.com/download');
         * 2. 客户端内跳转，后面加上neteasereaderuri://xxx, 示例web:gethtmlclick;neteasereaderuri://type=2&entryid=a2a4841d50e04a31a6185becd23ff999_4
         * @apiGroup (#General:pageRedirect)
         * @apiPermission all
         */
        case 'gethtmlclick':
            newSchemaQuery = data.query.url;
            break;

        default:
            newSchemaQuery = data.query;
            break;
    }

    if (newSchemaPath.indexOf('neteasereaderuri') > -1) {
        if (isInternal) {
            newSchemaPath = 'web:gethtmlclick;' + newSchemaPath;
        }
        return {
            path: newSchemaPath,
            query: newSchemaQuery,
            seperator: ''
        };
    }

    return {
        path: newSchemaPath,
        query: newSchemaQuery
    };
};

var APIRead = function (_APIAbstract) {
    inherits(APIRead, _APIAbstract);

    function APIRead() {
        classCallCheck(this, APIRead);

        var _this = possibleConstructorReturn(this, (APIRead.__proto__ || Object.getPrototypeOf(APIRead)).call(this));

        _this.schemaName_ = 'web';
        return _this;
    }

    createClass(APIRead, [{
        key: 'isInApp',
        value: function isInApp() {
            return window.navigator.userAgent.toLocaleLowerCase().indexOf('pris') > 0;
        }

        /**
         * 通常情况下
         * @return {
         *  actionName: 对应的schema协议
         *  data: json或者string格式,json格式的后期会拼接成字符串(stringify)，string的直接使用
         *  callback: 定义schema协议对应的回调函数
         * }
         * 'pageRedirect'时 拼接path、query、seperator
         * @return {
         *   path: 协议path
         *   query: json或者string格式,json格式的后期会拼接成字符串(stringify)，string的直接使用
         *   seperator: 默认值';'
         * }
         */

    }, {
        key: 'getLegacyProtocolConfig',
        value: function getLegacyProtocolConfig(actionName, data) {
            switch (actionName) {
                /**
                * @api {post} share 唤起客户端分享模块
                * @apiName share
                * @apiGroup General
                * @apiDescription 唤起客户端分享模块，直接分享到对应的平台
                *
                * @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(仅限snail)
                * @apiParam {String} description 分享内容的描述
                * @apiParam {String} picurl 分享的缩略图url
                * @apiParam {String} link 分享内容的跳转url
                * @apiParam {String} [activity] 设置当前页的活动代号，用于特定活动的统计需求
                * @apiParam (yuedu) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，格式为channel:"['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qqfriend','_share_qzone','_share_ttengxun','_share_alipay']"
                * @apiParam (yuedu) {String} [topicId] 统计相关，分享内容id(专题id)
                * @apiParam (comic) {String} [text] 分享到微博的文字内容
                * @apiParam (comic) {String} [platform] 分享平台
                * @apiParam (comic) {String} [panel_title] 分享框的文案，默认文案是分享给朋友
                * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                *
                */
                case 'share':
                    var topicIdConfig = data.topicId ? { topicId: data.topicId } : {};
                    data = bridge_es_objectAssign({}, topicIdConfig, {
                        activityId: data.activity,
                        url: data.link,
                        pics: data.picurl,
                        summary: data.description,
                        title: data.title,
                        shareType: '1',
                        moduleType: data.channel || "['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qqfriend','_share_qzone','_share_ttengxun','_share_alipay']",
                        data: { "activityId": data.activity }
                    });
                    return {
                        actionName: 'getclientsharemodule',
                        data: {
                            data: JSON.stringify(data)
                        }
                    };
                    break;

                /**
                * @api {post} setShareConfig 设置右上角分享
                * @apiName setShareConfig
                * @apiGroup General
                * @apiDescription 设置分享参数后，客户端右上角显示分享
                *
                * @apiParam {String} title 分享内容的标题 或 分享到微博的文字内容(仅限snail)
                * @apiParam {String} description 分享内容的描述
                * @apiParam {String} picurl 分享的缩略图url
                * @apiParam {String} link 分享内容的跳转url
                * @apiParam {String} [activity] 设置当前页的活动代号，用于特定活动的统计需求
                * @apiParam (yuedu) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，格式为channel:"['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qqfriend','_share_qzone','_share_ttengxun','_share_alipay']"
                * @apiParam (yuedu) {String} [topicId] 统计相关，分享内容id(专题id)
                * @apiParam (comic) {String} [text] 分享到微博的文字内容
                * @apiParam (comic) {String} [platform] 分享平台
                * @apiParam (comic) {String} [panel_title] 分享框的文案，默认文案是分享给朋友
                * @apiParam (snail) {String} [channel] 不传代表可以分享到目前所有支持的分享渠道，用逗号分隔的字符串‘wechatFriend,wechatTimeline,weibo’对应微信好友、微信朋友圈、微博
                *
                */
                case 'setShareConfig':
                    topicIdConfig = data.topicId ? { topicId: data.topicId } : {};
                    data = bridge_es_objectAssign({}, topicIdConfig, {
                        activityId: data.activity,
                        url: data.link,
                        pics: data.picurl,
                        summary: data.description,
                        title: data.title,
                        shareType: '1',
                        moduleType: data.channel || "['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qqfriend','_share_qzone','_share_ttengxun','_share_alipay']",
                        data: { "activityId": data.activity }
                    });
                    return {
                        actionName: 'setSharePage',
                        data: {
                            data: JSON.stringify(data)
                        }
                    };
                    break;

                case 'getLoginUserToken':
                    return {
                        callback: {
                            name: 'active.tokenCallBack',
                            handler: function handler(data) {
                                if (data == "") {
                                    return { keys: "", atype: "", userName: "" };
                                }
                                return JSON.parse(decodeURIComponent(data));
                            }
                        }
                    };
                    break;

                /**
                 * @api {get} getQuickSignStatus 获取快速签到按钮开关的状态
                 * @apiName getQuickSignStatus
                 * @apiGroup Sign
                 * @apiPermission all
                 *
                 * @apiSuccess {Number} status 整型，如果用户打开快速签到入口开关，则为1，反之为0
                 */
                case 'getQuickSignStatus':
                    return {
                        callback: {
                            name: 'pris.getQuickSignCallBack',
                            handler: function handler(status) {
                                return { status: status };
                            }
                        }

                        /**
                         * @api {get} requestRegControl 获取签到提醒开关状态
                         * @apiName requestRegControl
                         * @apiGroup Sign
                         * @apiPermission all
                         *
                         * @apiSuccess {Number} status 整型，如果用户打开了提醒，则为1，反之为0
                         */
                    };case 'requestRegControl':
                    return {
                        callback: {
                            name: 'pris.setRegControl',
                            handler: function handler(status) {
                                return { status: status };
                            }
                        }

                        /**
                         * @api {get} getclientinfo 获取客户端信息
                         * @apiName getclientinfo
                         * @apiGroup General
                         * @apiPermission all
                         */
                    };case 'getclientinfo':
                    return {
                        callback: {
                            name: 'pris.setclientinfo',
                            handler: function handler(data) {
                                return JSON.parse(decodeURIComponent(data));
                            }
                        }
                    };
                    break;

                /**
                 * @api {get} updateClientUI 更新IOS应用UI
                 * @apiName updateClientUI
                 * @apiGroup General
                 * @apiDescription 通过参数去更新IOS应用的UI，如页面title和是否显示关闭按钮
                 * @apiPermission all
                 *
                 * @apiParam {String} type 更新UI的类型，包含title、showCloseButton、showSafariOpen等
                 * @apiParam {String} data 设置对应的具体数据：客户端title、'no'、'no'
                 */
                case 'updateClientUI':
                    return {
                        data: {
                            data: JSON.stringify(data)
                        }
                    };
                    break;

                /**
                 * @api {post} changeDocumentTitle 更改文档标题 
                 * @apiName changeDocumentTitle
                 * @apiGroup General
                 * @apiDescription 更改文档标题，对应schema：安卓里面的web:setTitle;data=xxx，IOS里面的web:updateClientUI;data=xxx
                 * @apiPermission all
                 *
                 * @apiParam {String} title 标题
                 * @apiSuccess {Number} code 0为成功，其他为失败
                 * @apiSuccess {String} [message] 可选，失败时的消息
                 * @apiVersion 0.0.5
                 */
                case 'changeDocumentTitle':
                    if (bridge_es_ios()) {
                        return {
                            actionName: 'updateClientUI',
                            data: {
                                data: JSON.stringify({ type: 'title', data: data.title })
                            }
                        };
                    }

                    return {
                        actionName: 'setTitle',
                        data: {
                            data: JSON.stringify(data)
                        }
                    };
                    break;
                /**
                 * @api {post} closeCurrentWebview 关闭当前客户端打开的webview
                * @apiName closeCurrentWebview
                * @apiGroup General
                * @apiDescription 关闭当前客户端打开的webview，可用于充值成功后关闭当前webview页，对应于web:closeCurrentPage
                * @apiPermission all
                */
                case 'closeCurrentWebview':
                    return {
                        actionName: 'closeCurrentPage'
                    };
                    break;
                /**
                 * @api {post} wapChannel wap端向客户端调用请求通道接口
                * @apiName wapChannel
                * @apiGroup Util
                * @apiDescription wap端向客户端调用请求通道接口
                * @apiPermission all
                *
                * @apiParam {String} action 请求的类型，需要与后台约定好请求操作的类型值
                * @apiParam {json} [data] 请求数据，可以是json格式(data:{"userId": "67335423034"})也可以是string(如data: "dailySign")
                *
                * @apiSuccess {String} action 请求类型
                * @apiSuccess {json} response 后台返回的响应结果（schema方式获取后要decode处理）
                */
                case 'wapChannel':
                    return {
                        data: {
                            action: data.action,
                            data: typeof data.data == 'string' ? data.data : JSON.stringify(data.data || {})
                        },
                        callback: {
                            name: 'pris.wapChannelCallback',
                            handler: function handler(action, response) {
                                return {
                                    action: action,
                                    response: JSON.parse(decodeURIComponent(response))
                                };
                            }
                        }
                    };
                    break;
                /**
                 * @api {post} getRecharge 调起苹果支付。目前只有ios 5版本以上适用
                * @apiName getRecharge
                * @apiGroup General
                * @apiPermission all
                *
                * @apiSuccess {Number} rechargeResult 如果为大于0的整数，表示充值成功，该整数值为充值金额;为0表示充值失败
                * @apiSuccess {String} rechargeId  rechargeId为协议返回的本次充值成功的rechargeId，充值失败时返回""
                */
                case 'getRecharge':
                    return {
                        callback: {
                            name: 'pris.updateRechargeStatus',
                            handler: function handler(rechargeResult, rechargeId) {
                                return {
                                    rechargeResult: rechargeResult,
                                    rechargeId: rechargeId || ''
                                };
                            }
                        }
                    };
                    break;

                /**
                * @api {get} setRegResult 签到成功通知客户端
                * @apiName setRegResult
                * @apiGroup Sign
                * @apiPermission all
                *
                * @apiParam (570版本前) {Number} res 签到结果， 1为成功，0为失败
                * @apiParam (570版本前) {String} propmt 提示文案，不能为空
                * @apiParam (570版本前) {String} advertUrl 广告图片，可为空
                * @apiParam (570版本及以后) {String} propmt 提示文案，不能为空
                * @apiParam (570版本及以后) {String} advertUrl 广告图片，可为空
                * @apiParam (570版本及以后) {Number} count 签到获得的红包数
                * @apiParam (570版本及以后) {Json} module Json格式 {list:[,,], hint:'标题', module:59}
                */
                case 'setRegResult':
                    if (compareVersion$1(getVersion(), '5.7.0') >= 0) {
                        return {
                            data: {
                                data: JSON.stringify(data)
                            }
                        };
                    }
                    break;

                /**
                * @api {post} doTradeSuccess 书籍或章节购买成功
                * @apiDescription 书籍或章节购买成功
                * @apiName doTradeSuccess
                * @apiGroup Notice
                * @apiPermission all
                *
                * @apiParam {String} bookId 书籍id
                * @apiParam {String} chapterIds 多个章节以逗号分隔
                * @apiParam {String} [type] 购买成功方式，type=baoyue表示书籍已包月
                */
                case 'doTradeSuccess':
                    //schema要求的格式：web:doTradeSuccess;bookId=cf3587af574a4056a798878f59fa1b60_4;chapterIds=4acd95d7b3c34b9dabe33062ba30721d_4,5529eab97e5d4a60b0081b8140a1c03b_4
                    var result = [];
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {
                            result.push(i + '=' + data[i]);
                        }
                    }
                    return {
                        data: result.join(';')
                    };
                    break;

                case 'noticeStats':
                    var result = [];
                    for (var i in data) {
                        if (data.hasOwnProperty(i)) {
                            result.push(i + '=' + data[i]);
                        }
                    }
                    return {
                        data: result.join('&')
                    };
                    break;

                case 'pageRedirect':
                    return {
                        data: getPageRedirectData$1(data)
                    };
                    break;
            }
        }
    }, {
        key: 'getComputedUrl',
        value: function getComputedUrl(path) {
            if (/[\w0-9]+:\/\//.test(path)) {
                return path;
            }

            return this.schemaName_ + ':' + path;
        }
    }]);
    return APIRead;
}(APIAbstract);

var callHandler$6 = function callHandler$$2(actionName, data, callback) {
    callHandler$4(APIRead, actionName, data, callback, ';');
};

/**
 * 获取某个API对应的schema url，例如schemaGetter('pageRedirect', {path: 'recharge'}) 会返回'nereader://yuedu.163.com/v1?action=1&out=0'
 * @param  {string}   actionName    API名字，同callHandler
 * @param  {json}     data          json格式参数，同callHandler
 * @return {string}                 返回生成的schema url
 */
var APIInstance$1 = void 0;
var schemaGetter = function schemaGetter(actionName, data) {
    APIInstance$1 = APIInstance$1 || new APIRead();
    var seperator = ';';
    var obj = APIInstance$1.getLegacyProtocolConfig(actionName, data) || {};
    actionName = obj.actionName || actionName;
    data = obj.data || data;
    if (data.seperator !== undefined) {
        seperator = data.seperator;
    }
    if (actionName == 'pageRedirect') {
        actionName = data.path;
        data = data.query;
    }
    var path = APIInstance$1.getComputedUrl(actionName);

    return path + seperator + stringify(data);
};

var registerHandler$2 = function registerHandler$$1(actionName, callback) {
    switch (actionName) {
        //新接口兼容老版本
        /**
        * @api {get} shareComplete 分享完成，客户端通知h5
        * @apiName shareComplete
        * @apiDescription 客户端完成右上角分享后，通知h5分享结果
        * @apiGroup registerHandler
        * @apiPermission jsbridge
        * @apiParam {Number} code 0为成功，其他为失败
        * @apiParam {String} [message] 可选，失败时的消息
        * @apiParam {String} platform 分享平台
        *
        *
        */
        case 'shareComplete':
            if (!support$2('shareComplete')) {
                window.active = window.active || {};
                active.shareCompleted = function (result) {
                    var ua = navigator.userAgent.toLowerCase();
                    var isAndroid$$1 = ua.indexOf("android") > -1;
                    if (isAndroid$$1) {
                        //安卓失败不会回调，故只要回调就是成功
                        callback({ code: 0 });
                    } else {
                        callback(JSON.parse(decodeURIComponent(result)));
                    }
                };
                return;
            }
            break;

        /**
         * @api {get} commentClientComplete 通知h5评价完成
         * @apiName commentClientComplete
         * @apiDescription 调起评价客户端后，跳转回到客户端，客户端通知h5页面评价完成
         * @apiGroup registerHandler
         * @apiPermission jsbridge
         *
         */
        case 'commentClientComplete':
            if (!support$2('commentClientComplete')) {
                window.active = window.active || {};
                active.commentClientCallback = function () {
                    callback();
                };
                return;
            }
            break;

        /**
          * @api {get} bindMobileComplete 通知h5手机号绑定成功
          * @apiName bindMobileComplete
          * @apiDescription 通知h5手机号绑定成功
          * @apiGroup registerHandler
          * @apiPermission jsbridge
          *
          * @apiParam {Number} code 0: 绑定成功
          *
          */
        case 'bindMobileComplete':
            if (!support$2('bindMobileComplete')) {
                window.active = window.active || {};
                active.bindMobileCallback = function (result) {
                    callback(JSON.parse(decodeURIComponent(result)));
                };
                return;
            }
            break;

        /**
          * @api {get} buyBookCallback 通知h5书籍购买结果
          * @apiName buyBookCallback
          * @apiDescription 通知h5书籍购买结果
          * @apiGroup registerHandler
          * @apiPermission jsbridge
          *
          * @apiParam {Number} code 0: 购买成功，code -1: 购买失败
          * @apiParam {String} bookid 书籍id
          *
          */
        case 'buyBookCallback':
            if (!support$2('buyBookCallback')) {
                window.active = window.active || {};
                active.buyBookCallback = function (result) {
                    callback(JSON.parse(decodeURIComponent(result)));
                };
                return;
            }
            break;

        case 'buyPackageCallback':
            if (!support$2('buyPackageCallback')) {
                window.active = window.active || {};
                active.buyPackageCallback = function (result) {
                    callback(JSON.parse(decodeURIComponent(result)));
                };
                return;
            }
    }
    registerHandler(actionName, callback);
};

var map$4 = {
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

var support$4 = function support(actionName) {
    return libSupport(actionName, map$4);
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

var getAppVersion$2 = function getAppVersion() {
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

var getShouldUseNewSchema$2 = function getShouldUseNewSchema() {
    var clientVersionObj = getAppVersion$2();

    if (!clientVersionObj) return false;

    if (clientVersionObj.mainVersion > 2 || clientVersionObj.mainVersion === 2 && clientVersionObj.subVersion >= 4) {
        return true;
    }

    return false;
};

var getPageRedirectData$3 = function getPageRedirectData(data) {
    var shouldUseNewSchema = getShouldUseNewSchema$2();

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
var connectWebViewJavascriptBridge$1 = function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge);
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function () {
            callback(WebViewJavascriptBridge);
        }, false);
    }
};

var jbCallHandler4Ios$1 = function jbCallHandler4Ios(_actionName, _data, _callback) {
    connectWebViewJavascriptBridge$1(function (bridge) {
        bridge.callHandler(_actionName, _data, _callback);
    });
};

var jbRegisterHandler4Ios$1 = function jbRegisterHandler4Ios(_actionName, _callback) {
    connectWebViewJavascriptBridge$1(function (bridge) {
        bridge.init(function (responseCallback) {
            responseCallback(data);
        });
        bridge.registerHandler(_actionName, _callback);
    });
};

var APILofter$1 = function (_APIAbstract) {
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
                        data: getPageRedirectData$3(data)
                    };
            }
        }
    }]);
    return APILofter;
}(APIAbstract);

var nejCallHandler$1 = function nejCallHandler(actionName, data, callback) {
    callHandler$4(APILofter$1, actionName, data, callback);
};

/**
 * NEJSBridge 统一入口封装
 * js调客户端接口
 */
var callHandler$7 = function callHandler$$2(_actionName, _data, _callback) {
    var ua = navigator.userAgent.toLowerCase();
    var isAOS = ua.indexOf("android") > -1;
    var isIOS = ua.indexOf("iphone") > -1;

    try {
        switch (_actionName) {
            case 'showActionMenu':
                pageShowActions.actionMenu = function () {
                    callHandler$$2('showActionMenu');
                };
                break;
            case 'hideActionMenu':
                pageShowActions.actionMenu = function () {
                    callHandler$$2('hideActionMenu');
                };
                break;
            case 'saveShareContent':
                pageShowActions.saveShareContent = function () {
                    callHandler$$2('saveShareContent', _data);
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
            nejCallHandler$1(_actionName, _data, _callback);
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
                    nejCallHandler$1(_actionName, _data, _callback);
                } else {
                    //老的ios jsbridge方式
                    jbCallHandler4Ios$1(_actionName, _data, _callback);
                }
            }
        }
    } catch (e) {}
};

/**
 * NEJSBridge 统一入口封装
 * 注册js接口，供客户端调用
 */
var registerHandler$3 = function registerHandler$$1(_actionName, _callback) {
    var ua = navigator.userAgent.toLowerCase();
    var isAOS = ua.indexOf("android") > -1;
    var isIOS = ua.indexOf("iphone") > -1;
    try {
        _callback = _callback || function () {};
        //新接口一定为NEJSBridge接口，前缀统一为njb_
        if (_actionName.indexOf('njb_') == 0) {
            //新接口
            registerHandler(_actionName, _callback);
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
                    jbRegisterHandler4Ios$1(_actionName, _callback);
                }
            }
        }
    } catch (e) {}
};

var map$5 = {};

var support$5 = function support(actionName) {
    return libSupport(actionName, map$5);
};

var APISDK = function (_APIAbstract) {
    inherits(APISDK, _APIAbstract);

    function APISDK() {
        classCallCheck(this, APISDK);

        var _this = possibleConstructorReturn(this, (APISDK.__proto__ || Object.getPrototypeOf(APISDK)).call(this));

        _this.schemaName_ = 'wmsdk';
        return _this;
    }

    createClass(APISDK, [{
        key: 'isInApp',
        value: function isInApp() {
            return (/WinmanSDK/i.test(window.navigator.userAgent)
            );
        }
    }, {
        key: 'getLegacyProtocolConfig',
        value: function getLegacyProtocolConfig(actionName, data) {
            
        }
    }]);
    return APISDK;
}(APIAbstract);

var callHandler$8 = function callHandler$$2(actionName, data, callback) {
    callHandler$4(APISDK, actionName, data, callback, ';');
};



// EXTERNAL MODULE: ./node_modules/object-assign/index.js
var object_assign = __webpack_require__(7418);
var object_assign_default = /*#__PURE__*/__webpack_require__.n(object_assign);
;// CONCATENATED MODULE: ./node_modules/nw-share/es/guide/index.js
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Guide = /*#__PURE__*/function () {
  function Guide() {
    var _this = this;

    _classCallCheck(this, Guide);

    _defineProperty(this, "onClick", function () {
      _this.body.remove();
    });
  }

  _createClass(Guide, [{
    key: "render",
    value: function render() {
      var body = document.createElement('div');
      body.style.cssText = "\n            position: fixed;\n            top: 0;\n            right: 0;\n            left: 0;\n            bottom: 0;\n            text-align: right;\n            background-color: rgba(0,0,0,0.38);\n            z-index: 99;";
      body.onclick = this.onClick;
      body.innerHTML = "<img src=\"https://lofter.lf127.net/1617346844074/bg_wechat@2x.png\" width=\"271\" />";
      document.body.appendChild(body);
      this.body = body;
    }
  }]);

  return Guide;
}();

var showGuide = function showGuide() {
  var guide = new Guide();
  guide.render();
};
// EXTERNAL MODULE: ./node_modules/axios/index.js
var node_modules_axios = __webpack_require__(9669);
;// CONCATENATED MODULE: ./node_modules/nw-share/es/wechat/lofter.js
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// lofter域名的网页在微信内的分享

var wxSdkUrl = "https://res.wx.qq.com/open/js/jweixin-1.0.0.js";

function loadScript(url) {
  return new Promise(function (resolve, reject) {
    if (window.wx && typeof window.wx.config === 'function') {
      resolve();
      return;
    }

    var script = document.createElement('script');
    script.src = url;

    script.onload = function () {
      resolve();
    };

    script.onerror = function () {
      reject('sdk load faied');
    };

    document.body.appendChild(script);
  });
}

function lofter_shareLofterInWechat(shareConfig, callback) {
  var scriptPromise = loadScript(wxSdkUrl); // 20211210修改为www.lofter.com域名，该接口修改为支持跨域

  var dataPromise = axios.get('//www.lofter.com/spread/inherit/track/getWeiXinOpenSignature', {
    method: 'get',
    type: 'json',
    params: {
      url: location.href.split('#')[0]
    }
  });
  Promise.all([scriptPromise, dataPromise]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        res = _ref2[1];

    var data = res.data;

    if (!!data && data.code == 200) {
      window.wx.config({
        debug: false,
        appId: 'wxd8296e70dd0d29c3',
        timestamp: data.data.timestamp,
        nonceStr: data.data.noncestr,
        signature: data.data.signature,
        jsApiList: ['onMenuShareTimeline', 'onMenuShareAppMessage']
      });
      window.wx.ready(function () {
        wx.onMenuShareTimeline({
          title: shareConfig.title,
          link: shareConfig.link,
          imgUrl: shareConfig.picurl,
          success: callback
        });
        window.wx.onMenuShareAppMessage({
          title: shareConfig.title,
          desc: shareConfig.description,
          link: shareConfig.link,
          imgUrl: shareConfig.picurl,
          success: callback
        });
      });
    }
  }, function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        scriptErr = _ref4[0],
        dataErr = _ref4[1];

    if (scriptErr) {
      console.error(scriptErr);
    }

    ;

    if (dataErr) {
      console.error(dataErr);
    }
  });
}
;// CONCATENATED MODULE: ./node_modules/nw-share/es/index.js
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { es_defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function es_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





 // import {lofterShareConfig, lofetrShare} from './appShareApi';




var callApp = function callApp(schemeUrl) {
  var iframe = document.createElement("iframe");
  iframe.style.border = "none";
  iframe.style.width = "1px";
  iframe.style.height = "1px";
  iframe.src = schemeUrl;
  document.body.appendChild(iframe);
  window.setTimeout(function () {
    document.body.removeChild(iframe);
  }, 2000);
};

var weixinInstance;
var shareData;
var callback;
var setOrUpdate = function setOrUpdate(pshareData, callback_) {
  var isInitialSetup = !callback;

  callback = callback_ || function () {};

  shareData = _objectSpread({
    text: pshareData.title,
    link: window.location.href
  }, pshareData);

  if (/\.png/.test(shareData.picurl)) {
    if (shareData.picurl.indexOf('#') === -1) {
      if (shareData.picurl.indexOf('?') === -1) {
        shareData.picurl += '?';
      } else {
        shareData.picurl += '&';
      }

      shareData.picurl += 'type=jpg';
    }
  }

  if (/[^\d]/.test(shareData.activityId)) {
    throw new Error('activityId 只能由数字组成');
    return;
  }

  switch (true) {
    case isYixin():
    case isWeixin():
      // 微信内，lofter域名的网页不在微信白名单内，无法直接使用微信的jsbridge设置，分享参数设置需要特殊处理
      if (window.location.host.indexOf('lofter.com') >= 0) {
        shareLofterInWechat(shareData, callback_);
        return;
      }

      if (weixinInstance) {
        weixinInstance.setData({
          data: shareData,
          callback: callback_
        });
        return;
      }

      var JSBridgeName = isWeixin() ? 'WeixinJSBridge' : 'YixinJSBridge';
      weixinInstance = new Weixin({
        data: shareData,
        JSBridgeName: JSBridgeName,
        callback: callback
      });
      break;

    case isSnail():
      var snailData = {
        activity: shareData.activityId,
        channel: ['wechatFriend', 'wechatTimeline', 'qqZone', 'qqFriend', 'weibo'],
        "default": {
          title: shareData.title,
          description: shareData.description,
          image: shareData.picurl,
          url: shareData.link
        },
        weibo: {
          description: shareData.text || shareData.title,
          image: shareData.picurl
        }
      };
      snailRegisterHandler('shareComplete', function (json) {
        var ua = navigator.userAgent;

        if (ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1) {
          if (json.result) {
            callback();
          }
        } else {
          if (json.result && json.result === 'true') {
            callback();
          }
        }
      });
      snailCallHandler('setShareConfig2', snailData);
      break;

    case isComicApp():
      shareData.activity = shareData.activityId;

      if (isInitialSetup && navigator.userAgent.match(/NEJSBridge\/([\d.]+)\b/)) {
        callApp('neteasecomic://share/support');

        window.sendShareResult = function (platform, isOk) {
          if (callback) {
            callback({
              code: isOk === 'true' ? 0 : -1,
              platform: platform
            });
          }
        };

        window.getShareContent = function () {};
      }

      comicCallHandler('setShareConfig', shareData);
      break;

    case isLofter():
      var lofterData = {
        "id": shareData.activityId,
        "url": shareData.link,
        "content": {
          "weiboImg": shareData.picurl,
          "weiboDesc": "".concat(shareData.text, " ").concat(shareData.link),
          "fImg": shareData.picurl,
          "fTitle": shareData.title,
          "fDesc": shareData.description,
          "domains": []
        }
      };

      if (shareData.lofter) {
        lofterData.content.lofter = shareData.lofter;
      } // 市集webview只会在商详页等页面展示分享按钮，在卡牌页导致隐藏，此处增加调用分享则显示菜单逻辑


      if (lofterSupport('showActionMenu')) {
        lofterCallHandler('showActionMenu');
      } // lofterShareConfig(lofterData);


      lofterCallHandler('saveShareContent', lofterData);

      if (lofterSupport('njb_cbShareResult')) {
        lofterCallHandler('njb_cbShareResult', callback);
      }

      break;

    case isMusic():
      callApp('orpheus://settopbutton?icon=share&callback=onShare()&show=true');

      window.onShare = function () {
        var _options = {
          title: shareData.title,
          text: shareData.text,
          link: shareData.link,
          subTitle: shareData.description,
          picUrl: shareData.picurl ? shareData.picurl : undefined
        };
        var _arr = [];

        _arr.push(encodeURIComponent(_options.text));

        _arr.push(encodeURIComponent(_options.picUrl));

        _arr.push(encodeURIComponent(_options.link));

        _arr.push(encodeURIComponent(_options.title));

        _arr.push(encodeURIComponent(_options.subTitle));

        callApp('orpheus://share/' + _arr.join('/'));
        callback();
      };

      break;

    case isYueduApp():
      if (compareVersion(navigator.userAgent.match(/PRIS.*?\/([\d.]+)\b/)[1], '5.7.0') >= 0) {
        readRegisterHandler('shareComplete', callback);
        var yueduData = objectAssign({}, shareData, {
          activity: shareData.activityId,
          channel: shareData.channel || "['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qqfriend','_share_qzone','_share_ttengxun','_share_alipay']"
        });
        console.log(yueduData);
        readCallHandler('setShareConfig', yueduData);
      }

      break;
  }
};
var share = function share(data, callback_) {
  var shareDataLocal = data || shareData;

  if (!shareDataLocal) {
    return;
  }

  if (callback_) {
    callback = callback_;
  }

  callback = callback || function () {};

  if (es_isComicApp()) {
    callHandler$3('share', shareDataLocal, callback);
    return;
  }

  if (es_isSnail()) {
    var snailData = {
      activity: shareDataLocal.activityId,
      "default": {
        title: shareDataLocal.title,
        description: shareDataLocal.description,
        image: shareDataLocal.picurl,
        url: shareDataLocal.link
      },
      weibo: {
        description: shareDataLocal.text || shareDataLocal.title,
        image: shareDataLocal.picurl
      }
    };
    callHandler$5('share2', snailData);
    return;
  }

  if (es_isLofter()) {
    var lofterData = {
      "id": shareDataLocal.activityId,
      "url": shareDataLocal.link,
      "content": {
        "weiboImg": shareDataLocal.picurl,
        "weiboDesc": "".concat(shareDataLocal.text, " ").concat(shareDataLocal.link),
        "fImg": shareDataLocal.picurl,
        "fTitle": shareDataLocal.title,
        "fDesc": shareDataLocal.description,
        "domains": []
      }
    };

    if (data.lofter) {
      lofterData.content.lofter = data.lofter;
    } // 支持新版jsbridge分享


    if (support$4('njb_share')) {
      callHandler$7('njb_share', {
        shareCnt: lofterData
      });
    } else {
      // 使用老版jsbridge分享
      callHandler$7('saveShareContent', {
        shareCnt: lofterData
      });
      callHandler$7('showMenu');
    }

    if (support$4('njb_cbShareResult')) {
      callHandler$7('njb_cbShareResult', callback);
    }

    return;
  }

  if (es_isWeixin() || es_isYixin()) {
    if (weixinInstance) {
      var props = {
        data: data,
        callback: callback_
      };
      weixinInstance.setData(props);
    }

    showGuide();
    return;
  }

  if (es_isYueduApp()) {
    registerHandler$2('shareComplete', callback);
    var yueduData = object_assign_default()({}, shareDataLocal, {
      activity: shareDataLocal.activityId,
      channel: shareDataLocal.channel || "['_share_weixin','_share_weixinquan','_share_yixin','_share_yixinquan','_share_tsina','_share_qqfriend','_share_qzone','_share_ttengxun','_share_alipay']"
    });
    callHandler$6('share', yueduData);
    return;
  }

  if (navigator.share) {
    navigator.share({
      title: shareDataLocal.title,
      text: shareDataLocal.description,
      url: shareDataLocal.link
    }).then(function () {
      callback();
    })["catch"](function (error) {
      return console.log('Error sharing', error);
    });
  }
};

/***/ }),

/***/ 7418:
/***/ ((module) => {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


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

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
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


/***/ }),

/***/ 6135:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* export default binding */ __WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var nw_share__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4526);


/* harmony default export */ function __WEBPACK_DEFAULT_EXPORT__(data) {
  const shareData = data || {
    title: '分享标题',
    desc: '分享描述',
    link: 'https://www.baidu.com',
    imgUrl: 'https://www.baidu.com/img/bd_logo1.png',
  };
  shareData.title += '-test'
  ;(0,nw_share__WEBPACK_IMPORTED_MODULE_0__/* .share */ .B)(shareData);
}

/***/ }),

/***/ 8593:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"_args":[["axios@0.21.4","/Users/liushichuan/Documents/code/koa/static/webpack-demo"]],"_from":"axios@0.21.4","_id":"axios@0.21.4","_inBundle":false,"_integrity":"sha512-ut5vewkiu8jjGBdqpM44XxjuCjq9LAKeHVmoVfHVzy8eHgxxq8SbAVQNovDA8mVi05kP0Ea/n/UzcSHcTJQfNg==","_location":"/axios","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"axios@0.21.4","name":"axios","escapedName":"axios","rawSpec":"0.21.4","saveSpec":null,"fetchSpec":"0.21.4"},"_requiredBy":["/nw-share"],"_resolved":"https://registry.npmjs.org/axios/-/axios-0.21.4.tgz","_spec":"0.21.4","_where":"/Users/liushichuan/Documents/code/koa/static/webpack-demo","author":{"name":"Matt Zabriskie"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"bugs":{"url":"https://github.com/axios/axios/issues"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}],"dependencies":{"follow-redirects":"^1.14.0"},"description":"Promise based HTTP client for the browser and node.js","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"homepage":"https://axios-http.com","jsdelivr":"dist/axios.min.js","keywords":["xhr","http","ajax","promise","node"],"license":"MIT","main":"index.js","name":"axios","repository":{"type":"git","url":"git+https://github.com/axios/axios.git"},"scripts":{"build":"NODE_ENV=production grunt build","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","examples":"node ./examples/server.js","fix":"eslint --fix lib/**/*.js","postversion":"git push && git push --tags","preversion":"npm test","start":"node ./sandbox/server.js","test":"grunt test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json"},"typings":"./index.d.ts","unpkg":"dist/axios.min.js","version":"0.21.4"}');

/***/ })

}]);