if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global2 = uni.requireGlobal();
  ArrayBuffer = global2.ArrayBuffer;
  Int8Array = global2.Int8Array;
  Uint8Array = global2.Uint8Array;
  Uint8ClampedArray = global2.Uint8ClampedArray;
  Int16Array = global2.Int16Array;
  Uint16Array = global2.Uint16Array;
  Int32Array = global2.Int32Array;
  Uint32Array = global2.Uint32Array;
  Float32Array = global2.Float32Array;
  Float64Array = global2.Float64Array;
  BigInt64Array = global2.BigInt64Array;
  BigUint64Array = global2.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  const ON_SHOW = "onShow";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const createHook = (lifecycle) => (hook, target = vue.getCurrentInstance()) => {
    !vue.isInSSRComponentSetup && vue.injectHook(lifecycle, hook, target);
  };
  const onShow = /* @__PURE__ */ createHook(ON_SHOW);
  const httpRequest = (method) => async (url, data) => {
    return new Promise((resolve, reject) => {
      uni.request({
        url: `http://daka.nanjingyunpeng.cn/api${url}`,
        // API基础URL需加在这里
        method: method.toUpperCase(),
        data,
        header: {
          token: uni.getStorageSync("token") || ""
          // 添加token到请求头
        },
        success: (response) => {
          if (response.statusCode === 200) {
            resolve(response.data);
          } else {
            reject(new Error(`API错误: ${response.statusCode}`));
          }
        },
        fail: (error) => {
          formatAppLog("error", "at utils/api.js:193", `请求 ${method.toUpperCase()} ${url} 时出错:`, error);
          reject(error);
        }
      });
    });
  };
  const post = httpRequest("post");
  const storeData = (key, data) => {
    try {
      uni.setStorageSync(key, data);
      formatAppLog("log", "at utils/api.js:210", `${key} 存储成功`);
    } catch (err) {
      formatAppLog("error", "at utils/api.js:212", `${key} 存储失败`, err);
    }
  };
  const getUrlParameter = (paramName) => {
    if (typeof window === "undefined")
      return null;
    const href = window.location.href;
    const paramMatch = href.match(new RegExp(`[?&]${paramName}=([^&#]*)`));
    return paramMatch ? paramMatch[1] : null;
  };
  const checkLoginAndRedirect = () => {
    const token = uni.getStorageSync("token");
    formatAppLog("log", "at utils/api.js:225", token);
    if (token) {
      uni.switchTab({
        url: "/pages/index/index"
      });
      formatAppLog("log", "at utils/api.js:230", "已登录，跳转至主页");
    } else {
      uni.navigateTo({
        url: "/pages/login/login"
      });
      formatAppLog("log", "at utils/api.js:236", "未登录，跳转至登录页");
    }
  };
  const login = async (credentials) => {
    const response = await post("/user/mobilelogin", credentials);
    const {
      token,
      ...userInfo
    } = response.data.userinfo || {};
    formatAppLog("log", "at utils/api.js:246", response);
    if (!token) {
      throw new Error("未能获取token");
    }
    storeData("token", token);
    storeData("userInfo", JSON.stringify(userInfo));
    formatAppLog("log", "at utils/api.js:255", userInfo.company);
    return {
      token,
      // 返回token
      company: userInfo.company
      // 返回company字段
    };
  };
  const sendVerificationCode = async (mobile) => {
    return await post("/sms/send", {
      mobile,
      event: "mobilelogin"
    });
  };
  const punchIn = async (params) => {
    return await post("/index/point", params);
  };
  const submitInfo = async (params) => {
    return await post("/user/profile", params);
  };
  const getRecordList = async (params) => {
    return await post("/index/pointList", params);
  };
  const getPrizeList = async (params) => {
    return await post("/index/award", params);
  };
  const getMyPage = async () => {
    return await post("/index/getUser");
  };
  const submitInterestedProduct = async (params) => {
    return await post("/index/like", params);
  };
  const getPrizeRecord = async () => {
    return await post("/index/getMyAward");
  };
  const deletePrizeRecord = async (params) => {
    return await post("/index/delMyAward", params);
  };
  const _imports_0$1 = "/static/images/Frame.png";
  const _imports_1 = "/static/images/phone.png";
  const _imports_2 = "/static/images/arrow-down.png";
  const _imports_3 = "/static/images/code.png";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$6 = {
    __name: "login",
    setup(__props, { expose: __expose }) {
      __expose();
      const phone = vue.ref("");
      const verificationCode = vue.ref("");
      const isCodeSent = vue.ref(false);
      const countdown = vue.ref(60);
      let timer = null;
      const showToast = (title, icon = "none") => {
        uni.showToast({
          title,
          icon
        });
      };
      const sendVerificationCode$1 = async () => {
        const phonePattern = /^[1][3-9][0-9]{9}$/;
        if (!phonePattern.test(phone.value)) {
          return showToast("手机号格式不正确");
        }
        uni.showLoading({
          title: "发送中..."
        });
        try {
          await sendVerificationCode(phone.value);
          isCodeSent.value = true;
          startCountdown();
          showToast("验证码发送成功", "success");
        } catch (error) {
          showToast("发送验证码失败，请重试", "error");
          formatAppLog("error", "at pages/login/login.vue:72", "发送验证码错误:", error);
        } finally {
          uni.hideLoading();
        }
      };
      const startCountdown = () => {
        countdown.value = 60;
        clearInterval(timer);
        timer = setInterval(() => {
          countdown.value--;
          if (countdown.value <= 0) {
            clearInterval(timer);
            isCodeSent.value = false;
          }
        }, 1e3);
      };
      const login$1 = async () => {
        if (!verificationCode.value) {
          return showToast("请输入验证码");
        }
        uni.showLoading({
          title: "登录中..."
        });
        try {
          const {
            token,
            company
          } = await login({
            mobile: phone.value,
            captcha: verificationCode.value
          });
          showToast("登录成功", "success");
          formatAppLog("log", "at pages/login/login.vue:107", token);
          formatAppLog("log", "at pages/login/login.vue:108", company);
          if (!company) {
            uni.navigateTo({
              url: "/pages/information/information"
            });
          } else {
            uni.switchTab({
              url: "/pages/index/index"
            });
          }
          if (token) {
            uni.setStorage({
              key: "token",
              data: token,
              success: () => {
                formatAppLog("log", "at pages/login/login.vue:126", "Token存储成功");
              },
              fail: (err) => {
                formatAppLog("error", "at pages/login/login.vue:131", "Token存储失败", err);
              }
            });
          }
        } catch (error) {
          showToast("登录失败，请重试", "error");
          formatAppLog("error", "at pages/login/login.vue:137", "登录错误:", error);
        } finally {
          uni.hideLoading();
        }
      };
      vue.onMounted(() => {
        const param = getUrlParameter("param");
        if (param) {
          uni.setStorage({
            key: "param",
            data: param,
            success: () => formatAppLog("log", "at pages/login/login.vue:149", "param存储成功"),
            fail: (err) => formatAppLog("error", "at pages/login/login.vue:150", "param存储失败", err)
          });
        }
        checkLoginAndRedirect();
      });
      vue.watch(isCodeSent, (newVal) => {
        if (!newVal) {
          clearInterval(timer);
        }
      });
      const __returned__ = { phone, verificationCode, isCodeSent, countdown, get timer() {
        return timer;
      }, set timer(v) {
        timer = v;
      }, showToast, sendVerificationCode: sendVerificationCode$1, startCountdown, login: login$1, ref: vue.ref, watch: vue.watch, onMounted: vue.onMounted, get apiLogin() {
        return login;
      }, get apiSendCode() {
        return sendVerificationCode;
      }, get getUrlParameter() {
        return getUrlParameter;
      }, get checkLoginAndRedirect() {
        return checkLoginAndRedirect;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "login-container" }, [
      vue.createElementVNode("view", { class: "logo" }, [
        vue.createElementVNode("image", {
          style: { "width": "205px" },
          src: _imports_0$1,
          mode: "aspectFit"
        })
      ]),
      vue.createElementVNode("view", { class: "input-group" }, [
        vue.createElementVNode("view", { class: "input-container" }, [
          vue.createElementVNode("image", {
            src: _imports_1,
            class: "icon",
            mode: "aspectFit"
          }),
          vue.createElementVNode("text", { class: "country-code" }, "+86"),
          vue.createElementVNode("image", {
            style: { "width": "12px", "height": "12px", "margin-right": "12px" },
            src: _imports_2,
            mode: "aspectFit"
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input-field",
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => $setup.phone = $event),
              type: "text",
              placeholder: "请输入手机号"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.phone]
          ])
        ]),
        vue.createElementVNode("view", {
          style: { "height": "48px" },
          class: "input-container"
        }, [
          vue.createElementVNode("image", {
            src: _imports_3,
            class: "icon",
            mode: "aspectFit"
          }),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              class: "input-field",
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $setup.verificationCode = $event),
              type: "text",
              placeholder: "请输入验证码"
            },
            null,
            512
            /* NEED_PATCH */
          ), [
            [vue.vModelText, $setup.verificationCode]
          ]),
          vue.createElementVNode("view", {
            onClick: vue.withModifiers($setup.sendVerificationCode, ["stop"]),
            disabled: $setup.isCodeSent,
            class: vue.normalizeClass({ "code-button": true, "disabled-button": $setup.isCodeSent })
          }, vue.toDisplayString($setup.isCodeSent ? `${$setup.countdown}秒` : "获取验证码"), 11, ["disabled"])
        ])
      ]),
      vue.createElementVNode("button", {
        onClick: $setup.login,
        class: "login-button"
      }, " 登    录 ")
    ]);
  }
  const PagesLoginLogin = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$5], ["__scopeId", "data-v-e4e4508d"], ["__file", "C:/Users/Administrator/Desktop/Project Folder/打卡/打卡互动/attendance/pages/login/login.vue"]]);
  var isVue2 = false;
  function set(target, key, val) {
    if (Array.isArray(target)) {
      target.length = Math.max(target.length, key);
      target.splice(key, 1, val);
      return val;
    }
    target[key] = val;
    return val;
  }
  function del(target, key) {
    if (Array.isArray(target)) {
      target.splice(key, 1);
      return;
    }
    delete target[key];
  }
  function getDevtoolsGlobalHook() {
    return getTarget().__VUE_DEVTOOLS_GLOBAL_HOOK__;
  }
  function getTarget() {
    return typeof navigator !== "undefined" && typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {};
  }
  const isProxyAvailable = typeof Proxy === "function";
  const HOOK_SETUP = "devtools-plugin:setup";
  const HOOK_PLUGIN_SETTINGS_SET = "plugin:settings:set";
  let supported;
  let perf;
  function isPerformanceSupported() {
    var _a;
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else if (typeof global !== "undefined" && ((_a = global.perf_hooks) === null || _a === void 0 ? void 0 : _a.performance)) {
      supported = true;
      perf = global.perf_hooks.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function now() {
    return isPerformanceSupported() ? perf.now() : Date.now();
  }
  class ApiProxy {
    constructor(plugin, hook) {
      this.target = null;
      this.targetQueue = [];
      this.onQueue = [];
      this.plugin = plugin;
      this.hook = hook;
      const defaultSettings = {};
      if (plugin.settings) {
        for (const id in plugin.settings) {
          const item = plugin.settings[id];
          defaultSettings[id] = item.defaultValue;
        }
      }
      const localSettingsSaveId = `__vue-devtools-plugin-settings__${plugin.id}`;
      let currentSettings = Object.assign({}, defaultSettings);
      try {
        const raw = localStorage.getItem(localSettingsSaveId);
        const data = JSON.parse(raw);
        Object.assign(currentSettings, data);
      } catch (e) {
      }
      this.fallbacks = {
        getSettings() {
          return currentSettings;
        },
        setSettings(value) {
          try {
            localStorage.setItem(localSettingsSaveId, JSON.stringify(value));
          } catch (e) {
          }
          currentSettings = value;
        },
        now() {
          return now();
        }
      };
      if (hook) {
        hook.on(HOOK_PLUGIN_SETTINGS_SET, (pluginId, value) => {
          if (pluginId === this.plugin.id) {
            this.fallbacks.setSettings(value);
          }
        });
      }
      this.proxiedOn = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target.on[prop];
          } else {
            return (...args) => {
              this.onQueue.push({
                method: prop,
                args
              });
            };
          }
        }
      });
      this.proxiedTarget = new Proxy({}, {
        get: (_target, prop) => {
          if (this.target) {
            return this.target[prop];
          } else if (prop === "on") {
            return this.proxiedOn;
          } else if (Object.keys(this.fallbacks).includes(prop)) {
            return (...args) => {
              this.targetQueue.push({
                method: prop,
                args,
                resolve: () => {
                }
              });
              return this.fallbacks[prop](...args);
            };
          } else {
            return (...args) => {
              return new Promise((resolve) => {
                this.targetQueue.push({
                  method: prop,
                  args,
                  resolve
                });
              });
            };
          }
        }
      });
    }
    async setRealTarget(target) {
      this.target = target;
      for (const item of this.onQueue) {
        this.target.on[item.method](...item.args);
      }
      for (const item of this.targetQueue) {
        item.resolve(await this.target[item.method](...item.args));
      }
    }
  }
  function setupDevtoolsPlugin(pluginDescriptor, setupFn) {
    const descriptor = pluginDescriptor;
    const target = getTarget();
    const hook = getDevtoolsGlobalHook();
    const enableProxy = isProxyAvailable && descriptor.enableEarlyProxy;
    if (hook && (target.__VUE_DEVTOOLS_PLUGIN_API_AVAILABLE__ || !enableProxy)) {
      hook.emit(HOOK_SETUP, pluginDescriptor, setupFn);
    } else {
      const proxy = enableProxy ? new ApiProxy(descriptor, hook) : null;
      const list = target.__VUE_DEVTOOLS_PLUGINS__ = target.__VUE_DEVTOOLS_PLUGINS__ || [];
      list.push({
        pluginDescriptor: descriptor,
        setupFn,
        proxy
      });
      if (proxy)
        setupFn(proxy.proxiedTarget);
    }
  }
  /*!
   * pinia v2.1.7
   * (c) 2023 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = Symbol("pinia");
  function isPlainObject(o) {
    return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  const IS_CLIENT = typeof window !== "undefined";
  const USE_DEVTOOLS = IS_CLIENT;
  const _global = /* @__PURE__ */ (() => typeof window === "object" && window.window === window ? window : typeof self === "object" && self.self === self ? self : typeof global === "object" && global.global === global ? global : typeof globalThis === "object" ? globalThis : { HTMLElement: null })();
  function bom(blob, { autoBom = false } = {}) {
    if (autoBom && /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
      return new Blob([String.fromCharCode(65279), blob], { type: blob.type });
    }
    return blob;
  }
  function download(url, name, opts) {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.onload = function() {
      saveAs(xhr.response, name, opts);
    };
    xhr.onerror = function() {
      console.error("could not download file");
    };
    xhr.send();
  }
  function corsEnabled(url) {
    const xhr = new XMLHttpRequest();
    xhr.open("HEAD", url, false);
    try {
      xhr.send();
    } catch (e) {
    }
    return xhr.status >= 200 && xhr.status <= 299;
  }
  function click(node) {
    try {
      node.dispatchEvent(new MouseEvent("click"));
    } catch (e) {
      const evt = document.createEvent("MouseEvents");
      evt.initMouseEvent("click", true, true, window, 0, 0, 0, 80, 20, false, false, false, false, 0, null);
      node.dispatchEvent(evt);
    }
  }
  const _navigator = typeof navigator === "object" ? navigator : { userAgent: "" };
  const isMacOSWebView = /* @__PURE__ */ (() => /Macintosh/.test(_navigator.userAgent) && /AppleWebKit/.test(_navigator.userAgent) && !/Safari/.test(_navigator.userAgent))();
  const saveAs = !IS_CLIENT ? () => {
  } : (
    // Use download attribute first if possible (#193 Lumia mobile) unless this is a macOS WebView or mini program
    typeof HTMLAnchorElement !== "undefined" && "download" in HTMLAnchorElement.prototype && !isMacOSWebView ? downloadSaveAs : (
      // Use msSaveOrOpenBlob as a second approach
      "msSaveOrOpenBlob" in _navigator ? msSaveAs : (
        // Fallback to using FileReader and a popup
        fileSaverSaveAs
      )
    )
  );
  function downloadSaveAs(blob, name = "download", opts) {
    const a = document.createElement("a");
    a.download = name;
    a.rel = "noopener";
    if (typeof blob === "string") {
      a.href = blob;
      if (a.origin !== location.origin) {
        if (corsEnabled(a.href)) {
          download(blob, name, opts);
        } else {
          a.target = "_blank";
          click(a);
        }
      } else {
        click(a);
      }
    } else {
      a.href = URL.createObjectURL(blob);
      setTimeout(function() {
        URL.revokeObjectURL(a.href);
      }, 4e4);
      setTimeout(function() {
        click(a);
      }, 0);
    }
  }
  function msSaveAs(blob, name = "download", opts) {
    if (typeof blob === "string") {
      if (corsEnabled(blob)) {
        download(blob, name, opts);
      } else {
        const a = document.createElement("a");
        a.href = blob;
        a.target = "_blank";
        setTimeout(function() {
          click(a);
        });
      }
    } else {
      navigator.msSaveOrOpenBlob(bom(blob, opts), name);
    }
  }
  function fileSaverSaveAs(blob, name, opts, popup) {
    popup = popup || open("", "_blank");
    if (popup) {
      popup.document.title = popup.document.body.innerText = "downloading...";
    }
    if (typeof blob === "string")
      return download(blob, name, opts);
    const force = blob.type === "application/octet-stream";
    const isSafari = /constructor/i.test(String(_global.HTMLElement)) || "safari" in _global;
    const isChromeIOS = /CriOS\/[\d]+/.test(navigator.userAgent);
    if ((isChromeIOS || force && isSafari || isMacOSWebView) && typeof FileReader !== "undefined") {
      const reader = new FileReader();
      reader.onloadend = function() {
        let url = reader.result;
        if (typeof url !== "string") {
          popup = null;
          throw new Error("Wrong reader.result type");
        }
        url = isChromeIOS ? url : url.replace(/^data:[^;]*;/, "data:attachment/file;");
        if (popup) {
          popup.location.href = url;
        } else {
          location.assign(url);
        }
        popup = null;
      };
      reader.readAsDataURL(blob);
    } else {
      const url = URL.createObjectURL(blob);
      if (popup)
        popup.location.assign(url);
      else
        location.href = url;
      popup = null;
      setTimeout(function() {
        URL.revokeObjectURL(url);
      }, 4e4);
    }
  }
  function toastMessage(message, type) {
    const piniaMessage = "🍍 " + message;
    if (typeof __VUE_DEVTOOLS_TOAST__ === "function") {
      __VUE_DEVTOOLS_TOAST__(piniaMessage, type);
    } else if (type === "error") {
      console.error(piniaMessage);
    } else if (type === "warn") {
      console.warn(piniaMessage);
    } else {
      console.log(piniaMessage);
    }
  }
  function isPinia(o) {
    return "_a" in o && "install" in o;
  }
  function checkClipboardAccess() {
    if (!("clipboard" in navigator)) {
      toastMessage(`Your browser doesn't support the Clipboard API`, "error");
      return true;
    }
  }
  function checkNotFocusedError(error) {
    if (error instanceof Error && error.message.toLowerCase().includes("document is not focused")) {
      toastMessage('You need to activate the "Emulate a focused page" setting in the "Rendering" panel of devtools.', "warn");
      return true;
    }
    return false;
  }
  async function actionGlobalCopyState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(pinia.state.value));
      toastMessage("Global state copied to clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to serialize the state. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalPasteState(pinia) {
    if (checkClipboardAccess())
      return;
    try {
      loadStoresState(pinia, JSON.parse(await navigator.clipboard.readText()));
      toastMessage("Global state pasted from clipboard.");
    } catch (error) {
      if (checkNotFocusedError(error))
        return;
      toastMessage(`Failed to deserialize the state from clipboard. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  async function actionGlobalSaveState(pinia) {
    try {
      saveAs(new Blob([JSON.stringify(pinia.state.value)], {
        type: "text/plain;charset=utf-8"
      }), "pinia-state.json");
    } catch (error) {
      toastMessage(`Failed to export the state as JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  let fileInput;
  function getFileOpener() {
    if (!fileInput) {
      fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.accept = ".json";
    }
    function openFile() {
      return new Promise((resolve, reject) => {
        fileInput.onchange = async () => {
          const files = fileInput.files;
          if (!files)
            return resolve(null);
          const file = files.item(0);
          if (!file)
            return resolve(null);
          return resolve({ text: await file.text(), file });
        };
        fileInput.oncancel = () => resolve(null);
        fileInput.onerror = reject;
        fileInput.click();
      });
    }
    return openFile;
  }
  async function actionGlobalOpenStateFile(pinia) {
    try {
      const open2 = getFileOpener();
      const result2 = await open2();
      if (!result2)
        return;
      const { text, file } = result2;
      loadStoresState(pinia, JSON.parse(text));
      toastMessage(`Global state imported from "${file.name}".`);
    } catch (error) {
      toastMessage(`Failed to import the state from JSON. Check the console for more details.`, "error");
      console.error(error);
    }
  }
  function loadStoresState(pinia, state) {
    for (const key in state) {
      const storeState = pinia.state.value[key];
      if (storeState) {
        Object.assign(storeState, state[key]);
      } else {
        pinia.state.value[key] = state[key];
      }
    }
  }
  function formatDisplay(display) {
    return {
      _custom: {
        display
      }
    };
  }
  const PINIA_ROOT_LABEL = "🍍 Pinia (root)";
  const PINIA_ROOT_ID = "_root";
  function formatStoreForInspectorTree(store) {
    return isPinia(store) ? {
      id: PINIA_ROOT_ID,
      label: PINIA_ROOT_LABEL
    } : {
      id: store.$id,
      label: store.$id
    };
  }
  function formatStoreForInspectorState(store) {
    if (isPinia(store)) {
      const storeNames = Array.from(store._s.keys());
      const storeMap = store._s;
      const state2 = {
        state: storeNames.map((storeId) => ({
          editable: true,
          key: storeId,
          value: store.state.value[storeId]
        })),
        getters: storeNames.filter((id) => storeMap.get(id)._getters).map((id) => {
          const store2 = storeMap.get(id);
          return {
            editable: false,
            key: id,
            value: store2._getters.reduce((getters, key) => {
              getters[key] = store2[key];
              return getters;
            }, {})
          };
        })
      };
      return state2;
    }
    const state = {
      state: Object.keys(store.$state).map((key) => ({
        editable: true,
        key,
        value: store.$state[key]
      }))
    };
    if (store._getters && store._getters.length) {
      state.getters = store._getters.map((getterName) => ({
        editable: false,
        key: getterName,
        value: store[getterName]
      }));
    }
    if (store._customProperties.size) {
      state.customProperties = Array.from(store._customProperties).map((key) => ({
        editable: true,
        key,
        value: store[key]
      }));
    }
    return state;
  }
  function formatEventData(events) {
    if (!events)
      return {};
    if (Array.isArray(events)) {
      return events.reduce((data, event) => {
        data.keys.push(event.key);
        data.operations.push(event.type);
        data.oldValue[event.key] = event.oldValue;
        data.newValue[event.key] = event.newValue;
        return data;
      }, {
        oldValue: {},
        keys: [],
        operations: [],
        newValue: {}
      });
    } else {
      return {
        operation: formatDisplay(events.type),
        key: formatDisplay(events.key),
        oldValue: events.oldValue,
        newValue: events.newValue
      };
    }
  }
  function formatMutationType(type) {
    switch (type) {
      case MutationType.direct:
        return "mutation";
      case MutationType.patchFunction:
        return "$patch";
      case MutationType.patchObject:
        return "$patch";
      default:
        return "unknown";
    }
  }
  let isTimelineActive = true;
  const componentStateTypes = [];
  const MUTATIONS_LAYER_ID = "pinia:mutations";
  const INSPECTOR_ID = "pinia";
  const { assign: assign$1 } = Object;
  const getStoreType = (id) => "🍍 " + id;
  function registerPiniaDevtools(app, pinia) {
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app
    }, (api) => {
      if (typeof api.now !== "function") {
        toastMessage("You seem to be using an outdated version of Vue Devtools. Are you still using the Beta release instead of the stable one? You can find the links at https://devtools.vuejs.org/guide/installation.html.");
      }
      api.addTimelineLayer({
        id: MUTATIONS_LAYER_ID,
        label: `Pinia 🍍`,
        color: 15064968
      });
      api.addInspector({
        id: INSPECTOR_ID,
        label: "Pinia 🍍",
        icon: "storage",
        treeFilterPlaceholder: "Search stores",
        actions: [
          {
            icon: "content_copy",
            action: () => {
              actionGlobalCopyState(pinia);
            },
            tooltip: "Serialize and copy the state"
          },
          {
            icon: "content_paste",
            action: async () => {
              await actionGlobalPasteState(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Replace the state with the content of your clipboard"
          },
          {
            icon: "save",
            action: () => {
              actionGlobalSaveState(pinia);
            },
            tooltip: "Save the state as a JSON file"
          },
          {
            icon: "folder_open",
            action: async () => {
              await actionGlobalOpenStateFile(pinia);
              api.sendInspectorTree(INSPECTOR_ID);
              api.sendInspectorState(INSPECTOR_ID);
            },
            tooltip: "Import the state from a JSON file"
          }
        ],
        nodeActions: [
          {
            icon: "restore",
            tooltip: 'Reset the state (with "$reset")',
            action: (nodeId) => {
              const store = pinia._s.get(nodeId);
              if (!store) {
                toastMessage(`Cannot reset "${nodeId}" store because it wasn't found.`, "warn");
              } else if (typeof store.$reset !== "function") {
                toastMessage(`Cannot reset "${nodeId}" store because it doesn't have a "$reset" method implemented.`, "warn");
              } else {
                store.$reset();
                toastMessage(`Store "${nodeId}" reset.`);
              }
            }
          }
        ]
      });
      api.on.inspectComponent((payload, ctx) => {
        const proxy = payload.componentInstance && payload.componentInstance.proxy;
        if (proxy && proxy._pStores) {
          const piniaStores = payload.componentInstance.proxy._pStores;
          Object.values(piniaStores).forEach((store) => {
            payload.instanceData.state.push({
              type: getStoreType(store.$id),
              key: "state",
              editable: true,
              value: store._isOptionsAPI ? {
                _custom: {
                  value: vue.toRaw(store.$state),
                  actions: [
                    {
                      icon: "restore",
                      tooltip: "Reset the state of this store",
                      action: () => store.$reset()
                    }
                  ]
                }
              } : (
                // NOTE: workaround to unwrap transferred refs
                Object.keys(store.$state).reduce((state, key) => {
                  state[key] = store.$state[key];
                  return state;
                }, {})
              )
            });
            if (store._getters && store._getters.length) {
              payload.instanceData.state.push({
                type: getStoreType(store.$id),
                key: "getters",
                editable: false,
                value: store._getters.reduce((getters, key) => {
                  try {
                    getters[key] = store[key];
                  } catch (error) {
                    getters[key] = error;
                  }
                  return getters;
                }, {})
              });
            }
          });
        }
      });
      api.on.getInspectorTree((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          let stores = [pinia];
          stores = stores.concat(Array.from(pinia._s.values()));
          payload.rootNodes = (payload.filter ? stores.filter((store) => "$id" in store ? store.$id.toLowerCase().includes(payload.filter.toLowerCase()) : PINIA_ROOT_LABEL.toLowerCase().includes(payload.filter.toLowerCase())) : stores).map(formatStoreForInspectorTree);
        }
      });
      api.on.getInspectorState((payload) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return;
          }
          if (inspectedStore) {
            payload.state = formatStoreForInspectorState(inspectedStore);
          }
        }
      });
      api.on.editInspectorState((payload, ctx) => {
        if (payload.app === app && payload.inspectorId === INSPECTOR_ID) {
          const inspectedStore = payload.nodeId === PINIA_ROOT_ID ? pinia : pinia._s.get(payload.nodeId);
          if (!inspectedStore) {
            return toastMessage(`store "${payload.nodeId}" not found`, "error");
          }
          const { path } = payload;
          if (!isPinia(inspectedStore)) {
            if (path.length !== 1 || !inspectedStore._customProperties.has(path[0]) || path[0] in inspectedStore.$state) {
              path.unshift("$state");
            }
          } else {
            path.unshift("state");
          }
          isTimelineActive = false;
          payload.set(inspectedStore, path, payload.state.value);
          isTimelineActive = true;
        }
      });
      api.on.editComponentState((payload) => {
        if (payload.type.startsWith("🍍")) {
          const storeId = payload.type.replace(/^🍍\s*/, "");
          const store = pinia._s.get(storeId);
          if (!store) {
            return toastMessage(`store "${storeId}" not found`, "error");
          }
          const { path } = payload;
          if (path[0] !== "state") {
            return toastMessage(`Invalid path for store "${storeId}":
${path}
Only state can be modified.`);
          }
          path[0] = "$state";
          isTimelineActive = false;
          payload.set(store, path, payload.state.value);
          isTimelineActive = true;
        }
      });
    });
  }
  function addStoreToDevtools(app, store) {
    if (!componentStateTypes.includes(getStoreType(store.$id))) {
      componentStateTypes.push(getStoreType(store.$id));
    }
    setupDevtoolsPlugin({
      id: "dev.esm.pinia",
      label: "Pinia 🍍",
      logo: "https://pinia.vuejs.org/logo.svg",
      packageName: "pinia",
      homepage: "https://pinia.vuejs.org",
      componentStateTypes,
      app,
      settings: {
        logStoreChanges: {
          label: "Notify about new/deleted stores",
          type: "boolean",
          defaultValue: true
        }
        // useEmojis: {
        //   label: 'Use emojis in messages ⚡️',
        //   type: 'boolean',
        //   defaultValue: true,
        // },
      }
    }, (api) => {
      const now2 = typeof api.now === "function" ? api.now.bind(api) : Date.now;
      store.$onAction(({ after, onError, name, args }) => {
        const groupId = runningActionId++;
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🛫 " + name,
            subtitle: "start",
            data: {
              store: formatDisplay(store.$id),
              action: formatDisplay(name),
              args
            },
            groupId
          }
        });
        after((result2) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              title: "🛬 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                result: result2
              },
              groupId
            }
          });
        });
        onError((error) => {
          activeAction = void 0;
          api.addTimelineEvent({
            layerId: MUTATIONS_LAYER_ID,
            event: {
              time: now2(),
              logType: "error",
              title: "💥 " + name,
              subtitle: "end",
              data: {
                store: formatDisplay(store.$id),
                action: formatDisplay(name),
                args,
                error
              },
              groupId
            }
          });
        });
      }, true);
      store._customProperties.forEach((name) => {
        vue.watch(() => vue.unref(store[name]), (newValue, oldValue) => {
          api.notifyComponentUpdate();
          api.sendInspectorState(INSPECTOR_ID);
          if (isTimelineActive) {
            api.addTimelineEvent({
              layerId: MUTATIONS_LAYER_ID,
              event: {
                time: now2(),
                title: "Change",
                subtitle: name,
                data: {
                  newValue,
                  oldValue
                },
                groupId: activeAction
              }
            });
          }
        }, { deep: true });
      });
      store.$subscribe(({ events, type }, state) => {
        api.notifyComponentUpdate();
        api.sendInspectorState(INSPECTOR_ID);
        if (!isTimelineActive)
          return;
        const eventData = {
          time: now2(),
          title: formatMutationType(type),
          data: assign$1({ store: formatDisplay(store.$id) }, formatEventData(events)),
          groupId: activeAction
        };
        if (type === MutationType.patchFunction) {
          eventData.subtitle = "⤵️";
        } else if (type === MutationType.patchObject) {
          eventData.subtitle = "🧩";
        } else if (events && !Array.isArray(events)) {
          eventData.subtitle = events.type;
        }
        if (events) {
          eventData.data["rawEvent(s)"] = {
            _custom: {
              display: "DebuggerEvent",
              type: "object",
              tooltip: "raw DebuggerEvent[]",
              value: events
            }
          };
        }
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: eventData
        });
      }, { detached: true, flush: "sync" });
      const hotUpdate = store._hotUpdate;
      store._hotUpdate = vue.markRaw((newStore) => {
        hotUpdate(newStore);
        api.addTimelineEvent({
          layerId: MUTATIONS_LAYER_ID,
          event: {
            time: now2(),
            title: "🔥 " + store.$id,
            subtitle: "HMR update",
            data: {
              store: formatDisplay(store.$id),
              info: formatDisplay(`HMR update`)
            }
          }
        });
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
      });
      const { $dispose } = store;
      store.$dispose = () => {
        $dispose();
        api.notifyComponentUpdate();
        api.sendInspectorTree(INSPECTOR_ID);
        api.sendInspectorState(INSPECTOR_ID);
        api.getSettings().logStoreChanges && toastMessage(`Disposed "${store.$id}" store 🗑`);
      };
      api.notifyComponentUpdate();
      api.sendInspectorTree(INSPECTOR_ID);
      api.sendInspectorState(INSPECTOR_ID);
      api.getSettings().logStoreChanges && toastMessage(`"${store.$id}" store installed 🆕`);
    });
  }
  let runningActionId = 0;
  let activeAction;
  function patchActionForGrouping(store, actionNames, wrapWithProxy) {
    const actions = actionNames.reduce((storeActions, actionName) => {
      storeActions[actionName] = vue.toRaw(store)[actionName];
      return storeActions;
    }, {});
    for (const actionName in actions) {
      store[actionName] = function() {
        const _actionId = runningActionId;
        const trackedStore = wrapWithProxy ? new Proxy(store, {
          get(...args) {
            activeAction = _actionId;
            return Reflect.get(...args);
          },
          set(...args) {
            activeAction = _actionId;
            return Reflect.set(...args);
          }
        }) : store;
        activeAction = _actionId;
        const retValue = actions[actionName].apply(trackedStore, arguments);
        activeAction = void 0;
        return retValue;
      };
    }
  }
  function devtoolsPlugin({ app, store, options }) {
    if (store.$id.startsWith("__hot:")) {
      return;
    }
    store._isOptionsAPI = !!options.state;
    patchActionForGrouping(store, Object.keys(options.actions), store._isOptionsAPI);
    const originalHotUpdate = store._hotUpdate;
    vue.toRaw(store)._hotUpdate = function(newStore) {
      originalHotUpdate.apply(this, arguments);
      patchActionForGrouping(store, Object.keys(newStore._hmrPayload.actions), !!store._isOptionsAPI);
    };
    addStoreToDevtools(
      app,
      // FIXME: is there a way to allow the assignment from Store<Id, S, G, A> to StoreGeneric?
      store
    );
  }
  function createPinia() {
    const scope = vue.effectScope(true);
    const state = scope.run(() => vue.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = vue.markRaw({
      install(app) {
        setActivePinia(pinia);
        {
          pinia._a = app;
          app.provide(piniaSymbol, pinia);
          app.config.globalProperties.$pinia = pinia;
          if (USE_DEVTOOLS) {
            registerPiniaDevtools(app, pinia);
          }
          toBeInstalled.forEach((plugin) => _p.push(plugin));
          toBeInstalled = [];
        }
      },
      use(plugin) {
        if (!this._a && !isVue2) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      // it's actually undefined here
      // @ts-expect-error
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    if (USE_DEVTOOLS && typeof Proxy !== "undefined") {
      pinia.use(devtoolsPlugin);
    }
    return pinia;
  }
  function patchObject(newState, oldState) {
    for (const key in oldState) {
      const subPatch = oldState[key];
      if (!(key in newState)) {
        continue;
      }
      const targetValue = newState[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        newState[key] = patchObject(targetValue, subPatch);
      } else {
        {
          newState[key] = subPatch;
        }
      }
    }
    return newState;
  }
  const noop = () => {
  };
  function addSubscription(subscriptions, callback, detached, onCleanup = noop) {
    subscriptions.push(callback);
    const removeSubscription = () => {
      const idx = subscriptions.indexOf(callback);
      if (idx > -1) {
        subscriptions.splice(idx, 1);
        onCleanup();
      }
    };
    if (!detached && vue.getCurrentScope()) {
      vue.onScopeDispose(removeSubscription);
    }
    return removeSubscription;
  }
  function triggerSubscriptions(subscriptions, ...args) {
    subscriptions.slice().forEach((callback) => {
      callback(...args);
    });
  }
  const fallbackRunWithContext = (fn) => fn();
  function mergeReactiveObjects(target, patchToApply) {
    if (target instanceof Map && patchToApply instanceof Map) {
      patchToApply.forEach((value, key) => target.set(key, value));
    }
    if (target instanceof Set && patchToApply instanceof Set) {
      patchToApply.forEach(target.add, target);
    }
    for (const key in patchToApply) {
      if (!patchToApply.hasOwnProperty(key))
        continue;
      const subPatch = patchToApply[key];
      const targetValue = target[key];
      if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !vue.isRef(subPatch) && !vue.isReactive(subPatch)) {
        target[key] = mergeReactiveObjects(targetValue, subPatch);
      } else {
        target[key] = subPatch;
      }
    }
    return target;
  }
  const skipHydrateSymbol = Symbol("pinia:skipHydration");
  function shouldHydrate(obj) {
    return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
  }
  const { assign } = Object;
  function isComputed(o) {
    return !!(vue.isRef(o) && o.effect);
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && !hot) {
        {
          pinia.state.value[id] = state ? state() : {};
        }
      }
      const localState = hot ? (
        // use ref() to unwrap refs inside state TODO: check if this is still necessary
        vue.toRefs(vue.ref(state ? state() : {}).value)
      ) : vue.toRefs(pinia.state.value[id]);
      return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
        if (name in localState) {
          console.warn(`[🍍]: A getter cannot have the same name as another state property. Rename one of them. Found with "${name}" in store "${id}".`);
        }
        computedGetters[name] = vue.markRaw(vue.computed(() => {
          setActivePinia(pinia);
          const store2 = pinia._s.get(id);
          return getters[name].call(store2, store2);
        }));
        return computedGetters;
      }, {}));
    }
    store = createSetupStore(id, setup, options, pinia, hot, true);
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
    let scope;
    const optionsForPlugin = assign({ actions: {} }, options);
    if (!pinia._e.active) {
      throw new Error("Pinia destroyed");
    }
    const $subscribeOptions = {
      deep: true
      // flush: 'post',
    };
    {
      $subscribeOptions.onTrigger = (event) => {
        if (isListening) {
          debuggerEvents = event;
        } else if (isListening == false && !store._hotUpdating) {
          if (Array.isArray(debuggerEvents)) {
            debuggerEvents.push(event);
          } else {
            console.error("🍍 debuggerEvents should be an array. This is most likely an internal Pinia bug.");
          }
        }
      };
    }
    let isListening;
    let isSyncListening;
    let subscriptions = [];
    let actionSubscriptions = [];
    let debuggerEvents;
    const initialState = pinia.state.value[$id];
    if (!isOptionsStore && !initialState && !hot) {
      {
        pinia.state.value[$id] = {};
      }
    }
    const hotState = vue.ref({});
    let activeListener;
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncListening = false;
      {
        debuggerEvents = [];
      }
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: debuggerEvents
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: debuggerEvents
        };
      }
      const myListenerId = activeListener = Symbol();
      vue.nextTick().then(() => {
        if (activeListener === myListenerId) {
          isListening = true;
        }
      });
      isSyncListening = true;
      triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
    }
    const $reset = isOptionsStore ? function $reset2() {
      const { state } = options;
      const newState = state ? state() : {};
      this.$patch(($state) => {
        assign($state, newState);
      });
    } : (
      /* istanbul ignore next */
      () => {
        throw new Error(`🍍: Store "${$id}" is built using the setup syntax and does not implement $reset().`);
      }
    );
    function $dispose() {
      scope.stop();
      subscriptions = [];
      actionSubscriptions = [];
      pinia._s.delete($id);
    }
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        const afterCallbackList = [];
        const onErrorCallbackList = [];
        function after(callback) {
          afterCallbackList.push(callback);
        }
        function onError(callback) {
          onErrorCallbackList.push(callback);
        }
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this && this.$id === $id ? this : store, args);
        } catch (error) {
          triggerSubscriptions(onErrorCallbackList, error);
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            triggerSubscriptions(afterCallbackList, value);
            return value;
          }).catch((error) => {
            triggerSubscriptions(onErrorCallbackList, error);
            return Promise.reject(error);
          });
        }
        triggerSubscriptions(afterCallbackList, ret);
        return ret;
      };
    }
    const _hmrPayload = /* @__PURE__ */ vue.markRaw({
      actions: {},
      getters: {},
      state: [],
      hotState
    });
    const partialStore = {
      _p: pinia,
      // _s: scope,
      $id,
      $onAction: addSubscription.bind(null, actionSubscriptions),
      $patch,
      $reset,
      $subscribe(callback, options2 = {}) {
        const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
        const stopWatcher = scope.run(() => vue.watch(() => pinia.state.value[$id], (state) => {
          if (options2.flush === "sync" ? isSyncListening : isListening) {
            callback({
              storeId: $id,
              type: MutationType.direct,
              events: debuggerEvents
            }, state);
          }
        }, assign({}, $subscribeOptions, options2)));
        return removeSubscription;
      },
      $dispose
    };
    const store = vue.reactive(assign(
      {
        _hmrPayload,
        _customProperties: vue.markRaw(/* @__PURE__ */ new Set())
        // devtools custom properties
      },
      partialStore
      // must be added later
      // setupStore
    ));
    pinia._s.set($id, store);
    const runWithContext = pinia._a && pinia._a.runWithContext || fallbackRunWithContext;
    const setupStore = runWithContext(() => pinia._e.run(() => (scope = vue.effectScope()).run(setup)));
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (vue.isRef(prop) && !isComputed(prop) || vue.isReactive(prop)) {
        if (hot) {
          set(hotState.value, key, vue.toRef(setupStore, key));
        } else if (!isOptionsStore) {
          if (initialState && shouldHydrate(prop)) {
            if (vue.isRef(prop)) {
              prop.value = initialState[key];
            } else {
              mergeReactiveObjects(prop, initialState[key]);
            }
          }
          {
            pinia.state.value[$id][key] = prop;
          }
        }
        {
          _hmrPayload.state.push(key);
        }
      } else if (typeof prop === "function") {
        const actionValue = hot ? prop : wrapAction(key, prop);
        {
          setupStore[key] = actionValue;
        }
        {
          _hmrPayload.actions[key] = prop;
        }
        optionsForPlugin.actions[key] = prop;
      } else {
        if (isComputed(prop)) {
          _hmrPayload.getters[key] = isOptionsStore ? (
            // @ts-expect-error
            options.getters[key]
          ) : prop;
          if (IS_CLIENT) {
            const getters = setupStore._getters || // @ts-expect-error: same
            (setupStore._getters = vue.markRaw([]));
            getters.push(key);
          }
        }
      }
    }
    {
      assign(store, setupStore);
      assign(vue.toRaw(store), setupStore);
    }
    Object.defineProperty(store, "$state", {
      get: () => hot ? hotState.value : pinia.state.value[$id],
      set: (state) => {
        if (hot) {
          throw new Error("cannot set hotState");
        }
        $patch(($state) => {
          assign($state, state);
        });
      }
    });
    {
      store._hotUpdate = vue.markRaw((newStore) => {
        store._hotUpdating = true;
        newStore._hmrPayload.state.forEach((stateKey) => {
          if (stateKey in store.$state) {
            const newStateTarget = newStore.$state[stateKey];
            const oldStateSource = store.$state[stateKey];
            if (typeof newStateTarget === "object" && isPlainObject(newStateTarget) && isPlainObject(oldStateSource)) {
              patchObject(newStateTarget, oldStateSource);
            } else {
              newStore.$state[stateKey] = oldStateSource;
            }
          }
          set(store, stateKey, vue.toRef(newStore.$state, stateKey));
        });
        Object.keys(store.$state).forEach((stateKey) => {
          if (!(stateKey in newStore.$state)) {
            del(store, stateKey);
          }
        });
        isListening = false;
        isSyncListening = false;
        pinia.state.value[$id] = vue.toRef(newStore._hmrPayload, "hotState");
        isSyncListening = true;
        vue.nextTick().then(() => {
          isListening = true;
        });
        for (const actionName in newStore._hmrPayload.actions) {
          const action = newStore[actionName];
          set(store, actionName, wrapAction(actionName, action));
        }
        for (const getterName in newStore._hmrPayload.getters) {
          const getter = newStore._hmrPayload.getters[getterName];
          const getterValue = isOptionsStore ? (
            // special handling of options api
            vue.computed(() => {
              setActivePinia(pinia);
              return getter.call(store, store);
            })
          ) : getter;
          set(store, getterName, getterValue);
        }
        Object.keys(store._hmrPayload.getters).forEach((key) => {
          if (!(key in newStore._hmrPayload.getters)) {
            del(store, key);
          }
        });
        Object.keys(store._hmrPayload.actions).forEach((key) => {
          if (!(key in newStore._hmrPayload.actions)) {
            del(store, key);
          }
        });
        store._hmrPayload = newStore._hmrPayload;
        store._getters = newStore._getters;
        store._hotUpdating = false;
      });
    }
    if (USE_DEVTOOLS) {
      const nonEnumerable = {
        writable: true,
        configurable: true,
        // avoid warning on devtools trying to display this property
        enumerable: false
      };
      ["_p", "_hmrPayload", "_getters", "_customProperties"].forEach((p) => {
        Object.defineProperty(store, p, assign({ value: store[p] }, nonEnumerable));
      });
    }
    pinia._p.forEach((extender) => {
      if (USE_DEVTOOLS) {
        const extensions = scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        }));
        Object.keys(extensions || {}).forEach((key) => store._customProperties.add(key));
        assign(store, extensions);
      } else {
        assign(store, scope.run(() => extender({
          store,
          app: pinia._a,
          pinia,
          options: optionsForPlugin
        })));
      }
    });
    if (store.$state && typeof store.$state === "object" && typeof store.$state.constructor === "function" && !store.$state.constructor.toString().includes("[native code]")) {
      console.warn(`[🍍]: The "state" must be a plain object. It cannot be
	state: () => new MyClass()
Found in store "${store.$id}".`);
    }
    if (initialState && isOptionsStore && options.hydrate) {
      options.hydrate(store.$state, initialState);
    }
    isListening = true;
    isSyncListening = true;
    return store;
  }
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
      if (typeof id !== "string") {
        throw new Error(`[🍍]: "defineStore()" must be passed a store id as its first argument.`);
      }
    }
    function useStore(pinia, hot) {
      const hasContext = vue.hasInjectionContext();
      pinia = // in test mode, ignore the argument provided as we can always retrieve a
      // pinia instance with getActivePinia()
      pinia || (hasContext ? vue.inject(piniaSymbol, null) : null);
      if (pinia)
        setActivePinia(pinia);
      if (!activePinia) {
        throw new Error(`[🍍]: "getActivePinia()" was called but there was no active Pinia. Are you trying to use a store before calling "app.use(pinia)"?
See https://pinia.vuejs.org/core-concepts/outside-component-usage.html for help.
This will fail in production.`);
      }
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
        {
          useStore._pinia = pinia;
        }
      }
      const store = pinia._s.get(id);
      if (hot) {
        const hotId = "__hot:" + id;
        const newStore = isSetupStore ? createSetupStore(hotId, setup, options, pinia, true) : createOptionsStore(hotId, assign({}, options), pinia, true);
        hot._hotUpdate(newStore);
        delete pinia.state.value[hotId];
        pinia._s.delete(hotId);
      }
      if (IS_CLIENT) {
        const currentInstance = vue.getCurrentInstance();
        if (currentInstance && currentInstance.proxy && // avoid adding stores that are just built for hot module replacement
        !hot) {
          const vm = currentInstance.proxy;
          const cache = "_pStores" in vm ? vm._pStores : vm._pStores = {};
          cache[id] = store;
        }
      }
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  const useAttendanceStore = defineStore("attendance", () => {
    const logs = vue.ref([]);
    const setLogs = (data) => {
      logs.value = data;
    };
    formatAppLog("log", "at store/store.js:11", logs.value);
    return { logs, setLogs };
  });
  const _imports_0 = "/static/images/Fram1e.png";
  const _sfc_main$5 = {
    __name: "index",
    setup(__props, { expose: __expose }) {
      __expose();
      const attendanceStore = useAttendanceStore();
      const isCheckedIn = vue.ref(false);
      const productInfo = vue.ref({});
      const showToast = vue.ref(false);
      const selectedValue = vue.ref("");
      const ids = vue.ref([]);
      const icons = vue.ref([]);
      const radioOptions = vue.computed(
        () => attendanceStore.logs.map((log) => ({
          value: String(log.id),
          label: log.title,
          image: log.thumb
        }))
      );
      const updateIcons = () => {
        icons.value = attendanceStore.logs.map(() => "/static/images/iconno.png");
      };
      const closeToast = () => {
        showToast.value = false;
      };
      const openToast = () => {
        showToast.value = true;
      };
      const changeIcon = (index) => {
        icons.value[index] = icons.value[index] === "/static/images/iconno.png" ? "/static/images/iconis.png" : "/static/images/iconno.png";
      };
      const onRadioChange = (value) => {
        const numericValue = Number(value);
        const index = ids.value.indexOf(numericValue);
        if (index > -1) {
          ids.value.splice(index, 1);
        } else {
          ids.value.push(numericValue);
        }
        selectedValue.value = numericValue;
      };
      const handleRadioChange = (value, index) => {
        selectedValue.value = value;
        onRadioChange(value);
        changeIcon(index);
      };
      const submitProduct = async () => {
        try {
          const param = getUrlParameter("param") || uni.getStorageSync("param");
          const idsString = ids.value.join(",");
          const response = await submitInterestedProduct({
            param,
            ids: idsString
          });
          if (response.code === 1) {
            uni.showToast({
              title: response.msg,
              icon: "none",
              duration: 2e3
            });
            closeToast();
            updateIcons();
          } else {
            formatAppLog("error", "at pages/index/index.vue:130", "提交失败:", response.message || "未知错误");
          }
        } catch (error) {
          formatAppLog("error", "at pages/index/index.vue:133", "提交发生错误:", error.message || "未知错误");
        }
      };
      onShow(async () => {
        const param = uni.getStorageSync("param") || getUrlParameter("param");
        formatAppLog("log", "at pages/index/index.vue:139", param);
        if (param) {
          try {
            uni.setStorageSync("param", param);
            const punchResponse = await punchIn({
              param
            });
            isCheckedIn.value = punchResponse.data.is_point;
            productInfo.value = punchResponse.data.product;
            if (punchResponse.data.is_all && !punchResponse.data.is_like) {
              openToast();
            }
            attendanceStore.setLogs([...attendanceStore.logs, {
              is_point: isCheckedIn.value,
              product: productInfo.value
            }]);
            const recordResponse = await getRecordList({
              param
            });
            attendanceStore.setLogs(recordResponse.data || []);
            updateIcons();
          } catch (error) {
            formatAppLog("error", "at pages/index/index.vue:170", "操作失败:", error.message || "未知错误");
          }
        } else {
          formatAppLog("warn", "at pages/index/index.vue:173", "没有有效的参数");
        }
      });
      vue.onMounted(() => {
        checkLoginAndRedirect();
      });
      const __returned__ = { attendanceStore, isCheckedIn, productInfo, showToast, selectedValue, ids, icons, radioOptions, updateIcons, closeToast, openToast, changeIcon, onRadioChange, handleRadioChange, submitProduct, ref: vue.ref, computed: vue.computed, onMounted: vue.onMounted, get onShow() {
        return onShow;
      }, get punchIn() {
        return punchIn;
      }, get getRecordList() {
        return getRecordList;
      }, get getUrlParameter() {
        return getUrlParameter;
      }, get submitInterestedProduct() {
        return submitInterestedProduct;
      }, get checkLoginAndRedirect() {
        return checkLoginAndRedirect;
      }, get useAttendanceStore() {
        return useAttendanceStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      $setup.showToast ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "custom-toast"
      }, [
        vue.createCommentVNode(' <view class="overlay" @click="closeToast"></view> '),
        vue.createElementVNode("view", { class: "overlay" }),
        vue.createElementVNode("view", { class: "toast-content" }, [
          vue.createElementVNode("view", { class: "logo_tit" }, [
            vue.createElementVNode("image", {
              src: _imports_0$1,
              style: { "width": "145px", "height": "20px" }
            }),
            vue.createElementVNode("text", { style: { "font-size": "14px", "color": "#000000" } }, "请选择感兴趣的产品")
          ]),
          vue.createElementVNode("view", { class: "logs_box" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($setup.radioOptions, (item, index) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  class: "item",
                  key: item.value
                }, [
                  vue.createElementVNode("image", {
                    class: "log-image",
                    src: item.image
                  }, null, 8, ["src"]),
                  vue.createElementVNode(
                    "view",
                    { class: "product-name" },
                    vue.toDisplayString(item.label),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("view", {
                    style: { "text-align": "center", "margin": "auto" },
                    onClick: ($event) => $setup.handleRadioChange(item.value, index)
                  }, [
                    vue.createElementVNode("image", {
                      style: { "width": "24px", "height": "24px" },
                      src: $setup.icons[index],
                      mode: "scaleToFill"
                    }, null, 8, ["src"])
                  ], 8, ["onClick"])
                ]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "footer" }, [
            vue.createElementVNode("button", { onClick: $setup.submitProduct }, "提交")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode("view", { class: "info_img" }, [
        vue.createElementVNode("image", {
          style: { "width": "100%", "height": "100%" },
          src: $setup.productInfo.thumb
        }, null, 8, ["src"])
      ]),
      vue.createElementVNode("view", { class: "info_text" }, [
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($setup.productInfo.title),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "text",
          null,
          vue.toDisplayString($setup.productInfo.content),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "view",
          {
            class: vue.normalizeClass(["status", { "checked-in": $setup.isCheckedIn, "not-checked-in": !$setup.isCheckedIn }])
          },
          [
            $setup.isCheckedIn ? (vue.openBlock(), vue.createElementBlock("image", {
              key: 0,
              style: { "width": "16px", "height": "16px" },
              src: _imports_0
            })) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode(
              "text",
              null,
              vue.toDisplayString($setup.isCheckedIn ? "已打卡" : "未打卡"),
              1
              /* TEXT */
            )
          ],
          2
          /* CLASS */
        )
      ])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-1cf27b2a"], ["__file", "C:/Users/Administrator/Desktop/Project Folder/打卡/打卡互动/attendance/pages/index/index.vue"]]);
  const _sfc_main$4 = {
    __name: "logs",
    setup(__props, { expose: __expose }) {
      __expose();
      const attendanceStore = useAttendanceStore();
      const param = getUrlParameter("param") || uni.getStorageSync("param");
      const fetchLogs = async (param2) => {
        try {
          const response = await getRecordList({
            param: param2
          });
          return response.data || [];
        } catch (error) {
          formatAppLog("error", "at pages/logs/logs.vue:42", "获取打卡记录失败:", error);
          throw new Error("获取数据出错");
        }
      };
      onShow(async () => {
        if (param) {
          try {
            uni.setStorageSync("param", param);
            formatAppLog("log", "at pages/logs/logs.vue:51", "param存储成功");
            const logs = await fetchLogs(param);
            attendanceStore.setLogs(logs);
            formatAppLog("log", "at pages/logs/logs.vue:55", "获取打卡记录成功:", attendanceStore.logs);
          } catch (error) {
            uni.showToast({
              title: error.message || "获取打卡记录失败",
              icon: "none"
            });
          }
        } else {
          formatAppLog("warn", "at pages/logs/logs.vue:63", "未找到param参数");
          uni.showToast({
            title: "缺少param参数",
            icon: "none"
          });
        }
      });
      const __returned__ = { attendanceStore, param, fetchLogs, onMounted: vue.onMounted, get onShow() {
        return onShow;
      }, get getRecordList() {
        return getRecordList;
      }, get getUrlParameter() {
        return getUrlParameter;
      }, get useAttendanceStore() {
        return useAttendanceStore;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "box" }, [
      vue.createElementVNode("view", { class: "title" }, "打卡记录"),
      vue.createElementVNode("view", { class: "logs_box" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.attendanceStore.logs, (log, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              class: "item",
              key: index
            }, [
              vue.createElementVNode("image", {
                style: { "height": "165px" },
                class: "log-image",
                src: log.thumb,
                mode: ""
              }, null, 8, ["src"]),
              vue.createElementVNode(
                "view",
                { class: "product-name" },
                vue.toDisplayString(log.title),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["status", { "checked-in": log.is_point, "not-checked-in": !log.is_point }])
                },
                [
                  log.is_point ? (vue.openBlock(), vue.createElementBlock("image", {
                    key: 0,
                    style: { "width": "16px", "height": "16px" },
                    src: _imports_0,
                    mode: "aspectFill"
                  })) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "text",
                    null,
                    vue.toDisplayString(log.is_point ? "已打卡" : "未打卡"),
                    1
                    /* TEXT */
                  )
                ],
                2
                /* CLASS */
              )
            ]);
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ])
    ]);
  }
  const PagesLogsLogs = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-85735d8e"], ["__file", "C:/Users/Administrator/Desktop/Project Folder/打卡/打卡互动/attendance/pages/logs/logs.vue"]]);
  const _sfc_main$3 = {
    __name: "information",
    setup(__props, { expose: __expose }) {
      __expose();
      const infoArray = vue.ref([
        {
          label: "姓名",
          key: "nickname",
          value: "",
          placeholder: "请输入"
        },
        {
          label: "电话",
          key: "mobile",
          value: "",
          placeholder: "请输入"
        },
        {
          label: "公司",
          key: "company",
          value: "",
          placeholder: "请输入"
        },
        {
          label: "职位",
          key: "position",
          value: "",
          placeholder: "请输入"
        },
        {
          label: "地址",
          key: "address",
          value: "",
          placeholder: "请输入"
        }
      ]);
      const handleInput = (event, item) => {
        const value = event.detail.value;
        item.value = value;
        let isValid = false;
        item.errorMessage = "";
        switch (item.key) {
          case "nickname":
            isValid = /^[\u4e00-\u9fa5]{2,4}$/.test(value);
            item.errorMessage = isValid ? "" : "姓名必须为2到4个汉字";
            break;
          case "company":
            isValid = /^[\u4e00-\u9fa5]{4,15}$/.test(value);
            item.errorMessage = isValid ? "" : "公司名必须为4到15个汉字";
            break;
          case "address":
            isValid = /^[\u4e00-\u9fa5]{6,}$/.test(value);
            item.errorMessage = isValid ? "" : "地址必须至少为6个汉字";
            break;
          case "position":
            isValid = /^[\u4e00-\u9fa5]{2,5}$/.test(value);
            item.errorMessage = isValid ? "" : "职位必须为2到5个汉字";
            break;
          default:
            isValid = true;
        }
        formatAppLog("log", "at pages/information/information.vue:85", `Item: ${item.label} | Value: '${value}' | IsValid: ${isValid}`);
        if (!isValid) {
          uni.showToast({
            title: item.errorMessage,
            // 显示具体错误信息
            icon: "error",
            mask: true
          });
        }
      };
      const saveInfo = async () => {
        try {
          const allFilled = infoArray.value.every((item) => item.value.trim() !== "");
          if (!allFilled) {
            uni.showToast({
              title: "请填写所有字段",
              icon: "error",
              mask: true
            });
            return;
          }
          const requestData = Object.fromEntries(
            infoArray.value.map((item) => [item.key, item.value])
          );
          const result2 = await submitInfo(requestData);
          formatAppLog("log", "at pages/information/information.vue:114", "信息已保存", result2);
          if (result2.code === 0) {
            uni.showToast({
              title: result2.msg,
              icon: "error",
              mask: true
            });
          } else {
            uni.switchTab({
              url: "/pages/index/index"
            });
          }
        } catch (error) {
          formatAppLog("error", "at pages/information/information.vue:129", "提交信息时发生错误:", error.message);
          uni.showToast({
            title: result.msg,
            icon: "error",
            mask: true
          });
        }
      };
      vue.onMounted(() => {
        uni.getStorage({
          key: "userInfo",
          success: (res) => {
            const {
              mobile
            } = JSON.parse(res.data);
            const phoneItem = infoArray.value.find((item) => item.label === "电话");
            if (phoneItem) {
              phoneItem.value = mobile || "";
            }
          },
          fail: () => {
            formatAppLog("log", "at pages/information/information.vue:153", "未找到用户信息");
          }
        });
      });
      const __returned__ = { infoArray, handleInput, saveInfo, ref: vue.ref, onMounted: vue.onMounted, get submitInfo() {
        return submitInfo;
      }, get checkLoginAndRedirect() {
        return checkLoginAndRedirect;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "container" }, [
      vue.createElementVNode("view", { class: "information_box" }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($setup.infoArray, (item, index) => {
            return vue.openBlock(), vue.createElementBlock(
              "view",
              {
                class: vue.normalizeClass(["info-item", { "last-item": index === $setup.infoArray.length - 1 }]),
                key: index
              },
              [
                vue.createElementVNode(
                  "text",
                  null,
                  vue.toDisplayString(item.label),
                  1
                  /* TEXT */
                ),
                vue.withDirectives(vue.createElementVNode("input", {
                  "onUpdate:modelValue": ($event) => item.value = $event,
                  placeholder: item.placeholder,
                  type: "text",
                  onBlur: (event) => $setup.handleInput(event, item),
                  disabled: item.key === "mobile"
                }, null, 40, ["onUpdate:modelValue", "placeholder", "onBlur", "disabled"]), [
                  [vue.vModelText, item.value]
                ])
              ],
              2
              /* CLASS */
            );
          }),
          128
          /* KEYED_FRAGMENT */
        ))
      ]),
      vue.createElementVNode("view", { class: "footer" }, [
        vue.createElementVNode("button", { onClick: $setup.saveInfo }, "保存")
      ])
    ]);
  }
  const PagesInformationInformation = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-17c83bce"], ["__file", "C:/Users/Administrator/Desktop/Project Folder/打卡/打卡互动/attendance/pages/information/information.vue"]]);
  const _sfc_main$2 = {
    __name: "prize",
    setup(__props, { expose: __expose }) {
      __expose();
      const prize = vue.ref(null);
      const fetchPrizeData = async (param) => {
        try {
          const response = await getPrizeList({ param });
          prize.value = response.data;
        } catch (error) {
          formatAppLog("error", "at pages/prize/prize.vue:28", "打卡失败:", error);
        }
      };
      onShow(() => {
        const param = getUrlParameter("param") || uni.getStorageSync("param");
        if (param) {
          uni.setStorage({
            key: "param",
            data: param,
            success: () => formatAppLog("log", "at pages/prize/prize.vue:39", "param存储成功"),
            fail: (err) => formatAppLog("error", "at pages/prize/prize.vue:40", "param存储失败", err)
          });
          fetchPrizeData(param);
        } else {
          formatAppLog("warn", "at pages/prize/prize.vue:44", "参数未提供");
        }
      });
      const __returned__ = { prize, fetchPrizeData, ref: vue.ref, get onShow() {
        return onShow;
      }, get getPrizeList() {
        return getPrizeList;
      }, get getUrlParameter() {
        return getUrlParameter;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "prize_box" }, [
      vue.createElementVNode("view", { class: "title" }, "奖品"),
      $setup.prize ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "prize_content"
      }, [
        vue.createElementVNode("image", {
          style: { "width": "256px", "height": "256px" },
          src: $setup.prize.thumb,
          mode: "scaleToFill"
        }, null, 8, ["src"]),
        vue.createElementVNode(
          "text",
          { style: { "margin-top": "30px", "font-size": "18px", "font-weight": "bold", "color": "#333333" } },
          vue.toDisplayString($setup.prize.title),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "text",
          {
            class: "address",
            style: { "margin-top": "70px", "font-size": "20px" }
          },
          vue.toDisplayString($setup.prize.tips),
          1
          /* TEXT */
        ),
        $setup.prize.is_all ? (vue.openBlock(), vue.createElementBlock(
          "text",
          {
            key: 0,
            class: "address",
            style: { "font-size": "14px" }
          },
          vue.toDisplayString($setup.prize.address),
          1
          /* TEXT */
        )) : vue.createCommentVNode("v-if", true)
      ])) : (vue.openBlock(), vue.createElementBlock("view", { key: 1 }, [
        vue.createElementVNode("text", null, "加载奖品信息中...")
      ]))
    ]);
  }
  const PagesPrizePrize = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-b9fe9831"], ["__file", "C:/Users/Administrator/Desktop/Project Folder/打卡/打卡互动/attendance/pages/prize/prize.vue"]]);
  const _sfc_main$1 = {
    __name: "my",
    setup(__props, { expose: __expose }) {
      __expose();
      const info = vue.ref(null);
      const prizeRecords = vue.ref([]);
      const isModalVisible = vue.ref(false);
      const columnCount = vue.computed(() => prizeRecords.value.length > 1 ? 2 : 1);
      const fetchGetMyPage = async () => {
        try {
          const response = await getMyPage();
          info.value = response.data;
        } catch (error) {
          formatAppLog("error", "at pages/my/my.vue:58", "打卡失败:", error);
        }
      };
      const fetchGetPrizeRecord = async () => {
        try {
          const response = await getPrizeRecord();
          prizeRecords.value = response.data || [];
        } catch (error) {
          formatAppLog("error", "at pages/my/my.vue:67", "获取奖品记录失败:", error);
        }
      };
      const deletePrize = async (id) => {
        try {
          await deletePrizeRecord({ id: String(id) });
          prizeRecords.value = prizeRecords.value.filter((item) => item.id !== id);
          uni.showToast({
            title: "删除记录成功",
            icon: "success",
            duration: 2e3
            // 提示显示 2 秒后自动消失
          });
          if (prizeRecords.value.length === 0) {
            hidePrizeModal();
          }
        } catch (error) {
          formatAppLog("error", "at pages/my/my.vue:86", "删除记录失败:", error);
          uni.showToast({
            title: "删除记录失败",
            icon: "error",
            duration: 2e3
            // 提示显示 2 秒后自动消失
          });
        }
      };
      const handlePrizeClick = () => {
        if (prizeRecords.value.length === 0) {
          uni.showToast({
            title: "没有可领取的奖品",
            icon: "none",
            duration: 2e3
            // 提示显示 2 秒后自动消失
          });
        } else {
          showPrizeModal();
        }
      };
      const showPrizeModal = () => {
        isModalVisible.value = true;
      };
      const hidePrizeModal = () => {
        isModalVisible.value = false;
      };
      vue.onMounted(() => {
        fetchGetMyPage();
        fetchGetPrizeRecord();
      });
      const __returned__ = { info, prizeRecords, isModalVisible, columnCount, fetchGetMyPage, fetchGetPrizeRecord, deletePrize, handlePrizeClick, showPrizeModal, hidePrizeModal, ref: vue.ref, onMounted: vue.onMounted, computed: vue.computed, get getMyPage() {
        return getMyPage;
      }, get getPrizeRecord() {
        return getPrizeRecord;
      }, get deletePrizeRecord() {
        return deletePrizeRecord;
      } };
      Object.defineProperty(__returned__, "__isScriptSetup", { enumerable: false, value: true });
      return __returned__;
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return $setup.info ? (vue.openBlock(), vue.createElementBlock("view", {
      key: 0,
      class: "my_box"
    }, [
      vue.createElementVNode("view", { class: "title" }, "我的"),
      vue.createElementVNode("view", { class: "card" }, [
        vue.createElementVNode("image", {
          class: "logo",
          style: { "width": "87px", "height": "12px" },
          src: _imports_0$1,
          mode: "scaleToFill"
        }),
        vue.createElementVNode("view", { class: "user-info" }, [
          vue.createElementVNode(
            "view",
            { class: "name" },
            vue.toDisplayString($setup.info.nickname),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "view",
            { class: "phone" },
            vue.toDisplayString($setup.info.mobile),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", { class: "info" }, [
        vue.createElementVNode("view", { class: "item" }, [
          vue.createElementVNode("label", null, "公司"),
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.info.company),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "item" }, [
          vue.createElementVNode("label", null, "职位"),
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.info.position),
            1
            /* TEXT */
          )
        ]),
        vue.createElementVNode("view", { class: "item" }, [
          vue.createElementVNode("label", null, "地址"),
          vue.createElementVNode(
            "text",
            null,
            vue.toDisplayString($setup.info.address),
            1
            /* TEXT */
          )
        ])
      ]),
      vue.createElementVNode("view", {
        class: "info prize",
        onClick: $setup.handlePrizeClick
      }, [
        vue.createElementVNode("view", {
          style: { "display": "flex", "justify-content": "space-between" },
          class: "item"
        }, [
          vue.createElementVNode("label", null, "领奖记录"),
          vue.createElementVNode("text", { style: { "color": "#808080" } }, ">")
        ])
      ]),
      vue.createCommentVNode(" 蒙版 "),
      $setup.isModalVisible ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal-mask",
        onClick: $setup.hidePrizeModal
      })) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 弹窗 "),
      $setup.isModalVisible ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal"
      }, [
        vue.createElementVNode("view", {
          class: "close-btn",
          onClick: $setup.hidePrizeModal
        }, "✖"),
        vue.createCommentVNode(" 关闭按钮 "),
        vue.createElementVNode("view", { class: "modal-content" }, [
          vue.createElementVNode(
            "view",
            {
              class: "modal-body",
              style: vue.normalizeStyle({ columnCount: $setup.columnCount })
            },
            [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($setup.prizeRecords, (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "item_",
                    key: item.id
                  }, [
                    vue.createElementVNode("image", {
                      class: "log-image",
                      src: item.award_thumb
                    }, null, 8, ["src"]),
                    vue.createElementVNode(
                      "view",
                      {
                        style: { "padding": "10px 0" },
                        class: "product-name"
                      },
                      vue.toDisplayString(item.activity_title),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("text", {
                      class: "footer",
                      onClick: vue.withModifiers(($event) => $setup.deletePrize(item.id), ["stop"])
                    }, "删除", 8, ["onClick"])
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ],
            4
            /* STYLE */
          )
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ])) : vue.createCommentVNode("v-if", true);
  }
  const PagesMyMy = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__scopeId", "data-v-2f1ef635"], ["__file", "C:/Users/Administrator/Desktop/Project Folder/打卡/打卡互动/attendance/pages/my/my.vue"]]);
  __definePage("pages/login/login", PagesLoginLogin);
  __definePage("pages/index/index", PagesIndexIndex);
  __definePage("pages/logs/logs", PagesLogsLogs);
  __definePage("pages/information/information", PagesInformationInformation);
  __definePage("pages/prize/prize", PagesPrizePrize);
  __definePage("pages/my/my", PagesMyMy);
  const _sfc_main = {
    onLoad() {
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "C:/Users/Administrator/Desktop/Project Folder/打卡/打卡互动/attendance/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    const pinia = createPinia();
    app.use(pinia);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
