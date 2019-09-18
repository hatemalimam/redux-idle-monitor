"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

exports.default = createContext;

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _immutable = require("immutable");

var _constants = require("./constants");

var _defaults = require("./defaults");

var _reduxBlueprint = require("redux-blueprint");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var validateContext = function validateContext(libContext, appContext) {
  (0, _invariant2.default)(libContext, "must pass opts to validate");
  (0, _invariant2.default)(appContext, "must pass opts to validate");

  var libName = libContext.libName,
      appName = libContext.appName;
  var activeEvents = appContext.activeEvents,
      thresholds = appContext.thresholds;


  (0, _invariant2.default)(libName, "libName must exist");
  (0, _invariant2.default)(typeof libName === "string", "libName option must be a string");
  (0, _invariant2.default)(libName.length > 0, "libName option must not be empty");
  (0, _invariant2.default)(appName, "appName must exist");
  (0, _invariant2.default)(typeof appName === "string", "appName option must be a string");
  (0, _invariant2.default)(appName.length > 0, "appName option must not be empty");
  (0, _invariant2.default)(activeEvents, "active events must exist");
  (0, _invariant2.default)(thresholds, "thresholds must exist");
  (0, _invariant2.default)(thresholds.mouse, "thresholds.mouse must exist");
  (0, _invariant2.default)(typeof thresholds.mouse === "number", "thresholds.mouse must be a number corresponding to pixels");
  (0, _invariant2.default)(typeof thresholds.phaseOffMS === "number", "thresholds.phaseOffMS must be a number corresponding to minimum milliseconds between updates to redux");
  (0, _invariant2.default)(typeof thresholds.phaseOnMS === "number", "thresholds.phaseOnMS must be a number corresponding to minimum milliseconds between updates to redux");
};

var configureInitialState = function configureInitialState(libContext) {
  return function (appContext) {
    return new _immutable.Map({
      idleStatus: _constants.IDLESTATUS_ACTIVE,
      isRunning: false,
      isDetectionRunning: false,
      isIdle: false,
      lastActive: +new Date(),
      lastEvent: { x: -1, y: -1, type: null }
    });
  };
};

function createContext() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      appName = _ref.appName,
      IDLE_STATUSES = _ref.IDLE_STATUSES,
      idleStatusDelay = _ref.idleStatusDelay,
      activeStatusAction = _ref.activeStatusAction,
      idleStatusAction = _ref.idleStatusAction,
      _ref$activeEvents = _ref.activeEvents,
      activeEvents = _ref$activeEvents === undefined ? (0, _defaults.getActiveEvents)() : _ref$activeEvents,
      _ref$useFastStore = _ref.useFastStore,
      useFastStore = _ref$useFastStore === undefined ? (0, _defaults.getUseFastState)() : _ref$useFastStore,
      _ref$useLocalStore = _ref.useLocalStore,
      useLocalStore = _ref$useLocalStore === undefined ? (0, _defaults.getUseLocalState)() : _ref$useLocalStore,
      _ref$useWebRTCState = _ref.useWebRTCState,
      useWebRTCState = _ref$useWebRTCState === undefined ? (0, _defaults.getUseWebRTCState)() : _ref$useWebRTCState,
      _ref$useWebSocketsSta = _ref.useWebSocketsState,
      useWebSocketsState = _ref$useWebSocketsSta === undefined ? (0, _defaults.getUseWebSocketsState)() : _ref$useWebSocketsSta,
      _ref$thresholds = _ref.thresholds,
      thresholds = _ref$thresholds === undefined ? (0, _defaults.getThresholds)() : _ref$thresholds,
      _ref$level = _ref.level,
      level = _ref$level === undefined ? (0, _defaults.getLevel)() : _ref$level;

  var libName = _constants.ROOT_STATE_KEY;
  var libOpts = {
    libName: libName,
    validateContext: validateContext,
    configureAppContext: function configureAppContext(libContext) {
      return function (appOpts) {
        return appOpts;
      };
    },
    configureInitialState: configureInitialState
  };
  var appOpts = {
    appName: appName,
    IDLE_STATUSES: IDLE_STATUSES,
    idleStatusDelay: idleStatusDelay,
    activeStatusAction: activeStatusAction,
    idleStatusAction: idleStatusAction,
    activeEvents: activeEvents,
    useFastStore: useFastStore,
    useLocalStore: useLocalStore,
    useWebRTCState: useWebRTCState,
    useWebSocketsState: useWebSocketsState,
    thresholds: thresholds,
    level: level
  };
  return configureContext(libOpts)(appOpts);
}

var cleanActionName = function cleanActionName(name) {
  return name.toUpperCase().replace(/-+\s+/, "_");
};

/** Validates library creators options */
var validateLibOpts = function validateLibOpts(libOptsRaw) {
  (0, _invariant2.default)(libOptsRaw, "libOpts definition is required");
  var libName = libOptsRaw.libName,
      validateContext = libOptsRaw.validateContext,
      configureAppContext = libOptsRaw.configureAppContext,
      configureInitialState = libOptsRaw.configureInitialState;

  (0, _invariant2.default)(typeof libName === "string", "libName must be a string");
  (0, _invariant2.default)(libName.length > 0, "libName must not be empty");

  (0, _invariant2.default)(validateContext, "validateContext must exist");
  (0, _invariant2.default)(typeof validateContext === "function", "validateContext must be a function");

  (0, _invariant2.default)(configureAppContext, "configureAppContext must exist");
  (0, _invariant2.default)(typeof configureAppContext === "function", "configureAppContext must be a function");

  (0, _invariant2.default)(configureInitialState, "configureInitialState must exist");
  (0, _invariant2.default)(typeof configureInitialState === "function", "configureInitialState must be a function");
};

/** Validates library consumers options */
var validateAppOpts = function validateAppOpts(appOptsRaw) {
  (0, _invariant2.default)(appOptsRaw, "appOpts are required");
  var appName = appOptsRaw.appName;


  (0, _invariant2.default)(typeof appName === "string", "appName opt must be a string");
  (0, _invariant2.default)(appName.length > 0, "appName opt must not be empty");
};

function configureContext(libOpts) {
  var isDev = process.env.NODE_ENV !== "production";
  if (isDev) validateLibOpts(libOpts);
  var libName = libOpts.libName,
      validateContext = libOpts.validateContext,
      configureAppContext = libOpts.configureAppContext,
      configureInitialState = libOpts.configureInitialState;

  return function (appOpts) {
    if (isDev) validateAppOpts(appOpts);
    var appName = appOpts.appName,
        level = appOpts.level;


    var translateBlueprintType = function translateBlueprintType(blueprintType) {
      return cleanActionName(libName) + "_" + cleanActionName(appName) + "_" + cleanActionName(blueprintType);
    };
    var translateBlueprintTypes = (0, _reduxBlueprint.translateBlueprintTypesWith)(translateBlueprintType);
    var translateBlueprints = (0, _reduxBlueprint.translateBlueprintsWith)(translateBlueprintType);

    var libContext = {
      log: createLogger({ libName: libName, level: level }),
      libName: libName,
      appName: appName,
      translateBlueprintTypes: translateBlueprintTypes,
      translateBlueprints: translateBlueprints
    };

    var appContext = configureAppContext(libContext)(appOpts);
    if (isDev) validateContext(libContext, appContext);

    return (0, _assign2.default)(appContext, libContext, {
      get initialState() {
        return configureInitialState(libContext)(appContext);
      }
    });
  };
}

var noop = function noop() {};

function createLogger(_ref2) {
  var libName = _ref2.libName,
      level = _ref2.level;

  var _formatMessage = function _formatMessage(_ref3) {
    var level = _ref3.level,
        message = _ref3.message,
        obj = _ref3.obj;

    if (!message && typeof obj === "string") {
      message = obj;
      obj = noop();
    }
    return _formatLog(obj ? level + ": '" + message + "' => " + (0, _stringify2.default)(obj) : level + ": '" + message + "'");
  };

  var _formatLog = function _formatLog(message) {
    return libName + " | " + message;
  };

  return process.env.NODE_ENV !== "production" ? {
    trace: function trace(obj, message) {
      return level === "trace" ? console.trace(_formatMessage({ level: "trace", message: message, obj: obj })) : noop();
    },
    debug: function debug(obj, message) {
      return ["trace", "debug"].indexOf(level) !== -1 ? console.log(_formatMessage({ level: "debug", message: message, obj: obj })) : noop();
    },
    info: function info(obj, message) {
      return ["trace", "debug", "info"].indexOf(level) !== -1 ? console.info(_formatMessage({ level: "info", message: message, obj: obj })) : noop();
    },
    warn: function warn(obj, message) {
      return ["trace", "debug", "info", "warn"].indexOf(level) !== -1 ? console.warn(_formatMessage({ level: "warn", message: message, obj: obj })) : noop();
    },
    error: function error(obj, message) {
      return ["trace", "debug", "info", "warn", "error"].indexOf(level) !== -1 ? console.error(_formatMessage({ level: "error", message: message, obj: obj })) : noop();
    }
  } : { trace: noop, debug: noop, info: noop, warn: noop, error: noop };
}