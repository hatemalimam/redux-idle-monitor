"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDetection = undefined;

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _blueprints = require("./blueprints");

var _constants = require("./constants");

var _localsync = require("localsync");

var _localsync2 = _interopRequireDefault(_localsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var STOP_TYPES = ["pointermove", "MSPointerMove"];
var FILTER_TYPES = ["mousemove"];

var isBrowser = function isBrowser() {
  return (typeof window === "undefined" ? "undefined" : (0, _typeof3.default)(window)) === "object";
};

/** Detects whether the activity should trigger a redux update */
var createShouldActivityUpdate = function createShouldActivityUpdate(_ref) {
  var log = _ref.log,
      thresholds = _ref.thresholds;
  return function (store) {
    return function (_ref2) {
      var type = _ref2.type,
          pageX = _ref2.pageX,
          pageY = _ref2.pageY;

      if (STOP_TYPES.indexOf(type) !== -1) return false;
      if (!FILTER_TYPES.indexOf(type) !== -1) return true;
      /** If last event was not the same event type, trigger an update. */
      var lastActive = store.getState().getIn([_constants.ROOT_STATE_KEY, "lastActive"]);
      var lastEvent = store.getState().getIn([_constants.ROOT_STATE_KEY, "lastEvent"]);
      if (lastEvent.type !== type) return true;

      /** If last mouse events coordinates were not within mouse threshold, trigger an update. */
      var x = lastEvent.x,
          y = lastEvent.y;

      if (pageX && pageY && x && y && Math.abs(pageX - x) < thresholds.mouse && Math.abs(pageY - y) < thresholds.mouse) return false;
      return true;
    };
  };
};

var isRunning = function isRunning(dispatch, getState) {
  var isDetectionRunning = getState().getIn([_constants.ROOT_STATE_KEY, "isDetectionRunning"]);
  if (_constants.IS_DEV) {
    (0, _invariant2.default)(isDetectionRunning, "idle monitor state should have isDetectionRunning defined");
    (0, _invariant2.default)(typeof isDetectionRunning === "boolean", "isDetectionRunning should be type boolean");
  }
  return isDetectionRunning;
};

var createLocalSync = function createLocalSync(_ref3) {
  var log = _ref3.log,
      activity = _ref3.activity,
      getIsTransition = _ref3.getIsTransition;
  return function (store) {
    var action = function action(isActive) {
      if (isActive) return { isActive: isActive, lastActive: Date.now() };else return { isActive: isActive };
    };

    var handler = function handler(value, old, url) {
      log.info({ value: value, old: old, url: url }, "local sync");
      if (value.isActive) store.dispatch(activity({ type: "local", isTransition: getIsTransition() }));
    };
    return (0, _localsync2.default)("idlemonitor", action, handler);
  };
};

var createActivityDetection = function createActivityDetection(_ref4) {
  var log = _ref4.log,
      thresholds = _ref4.thresholds,
      activeEvents = _ref4.activeEvents,
      activity = _ref4.activity,
      activityDetection = _ref4.activityDetection,
      getIsTransition = _ref4.getIsTransition;
  return function (store) {
    var dispatch = store.dispatch;

    var shouldActivityUpdate = createShouldActivityUpdate({ log: log, thresholds: thresholds })(store);
    /** One of the event listeners triggered an activity occurrence event. This gets spammed */
    var onActivity = function onActivity(e) {
      if (!shouldActivityUpdate(e)) return;
      dispatch(activity({
        x: e.pageX,
        y: e.pageY,
        type: e.type,
        isTransition: getIsTransition()
      }));
    };

    var startActivityDetection = function startActivityDetection() {
      if (isBrowser()) activeEvents.forEach(function (x) {
        return document.addEventListener(x, onActivity);
      });
      dispatch(activityDetection(true));
    };
    var stopActivityDetection = function stopActivityDetection() {
      if (isBrowser()) activeEvents.forEach(function (x) {
        return document.removeEventListener(x, onActivity);
      });
      dispatch(activityDetection(false));
    };
    return { startActivityDetection: startActivityDetection, stopActivityDetection: stopActivityDetection };
  };
};

var createDetection = exports.createDetection = function createDetection(_ref5) {
  var log = _ref5.log,
      activeEvents = _ref5.activeEvents,
      thresholds = _ref5.thresholds,
      translateBlueprints = _ref5.translateBlueprints;
  return function (store) {
    var _translateBlueprints = translateBlueprints({
      activity: _blueprints.activityBlueprint,
      activityDetection: _blueprints.activityDetectionBlueprint
    }),
        activity = _translateBlueprints.activity,
        activityDetection = _translateBlueprints.activityDetection;

    var getIsTransition = function getIsTransition() {
      var idleStatus = store.getState().getIn([_constants.ROOT_STATE_KEY, "idleStatus"]);

      return idleStatus !== _constants.IDLESTATUS_ACTIVE;
    };

    var _createActivityDetect = createActivityDetection({
      log: log,
      thresholds: thresholds,
      activeEvents: activeEvents,
      activity: activity,
      activityDetection: activityDetection,
      getIsTransition: getIsTransition
    })(store),
        startActivityDetection = _createActivityDetect.startActivityDetection,
        stopActivityDetection = _createActivityDetect.stopActivityDetection;

    var localSync = createLocalSync({ log: log, activity: activity, getIsTransition: getIsTransition })(store);

    (0, _invariant2.default)(startActivityDetection, "startActivityDetection should be a return property of createActivityDetection");
    (0, _invariant2.default)(stopActivityDetection, "stopActivityDetection should be a return property of createActivityDetection");
    (0, _invariant2.default)(localSync, "localSync should exist");
    (0, _invariant2.default)(localSync.start, "localSync.start should exist");
    (0, _invariant2.default)(localSync.stop, "localSync.stop should exist");
    (0, _invariant2.default)(localSync.trigger, "localSync.trigger should exist");

    log.info("activity detection starting");

    return { startActivityDetection: startActivityDetection, stopActivityDetection: stopActivityDetection, localSync: localSync };
  };
};