"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMiddleware = undefined;

var _toConsumableArray2 = require("babel-runtime/helpers/toConsumableArray");

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

exports.default = configureMiddleware;

var _invariant = require("invariant");

var _invariant2 = _interopRequireDefault(_invariant);

var _context = require("./context");

var _context2 = _interopRequireDefault(_context);

var _constants = require("./constants");

var _blueprints = require("./blueprints");

var _actions = require("./actions");

var _states = require("./states");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** When context has already been created, it can be shared to middleware component. */
var createMiddleware = exports.createMiddleware = function createMiddleware(context) {
  var log = context.log,
      activeStatusAction = context.activeStatusAction,
      idleStatusAction = context.idleStatusAction,
      translateBlueprintTypes = context.translateBlueprintTypes,
      translateBlueprints = context.translateBlueprints,
      IDLE_STATUSES = context.IDLE_STATUSES,
      idleStatusDelay = context.idleStatusDelay,
      thresholds = context.thresholds;

  var _translateBlueprints = translateBlueprints(_blueprints.publicBlueprints),
      start = _translateBlueprints.start,
      stop = _translateBlueprints.stop;

  var _translateBlueprints2 = translateBlueprints({
    nextIdleStatusAction: _blueprints.nextIdleStatusBlueprint,
    lastIdleStatusAction: _blueprints.lastIdleStatusBlueprint
  }),
      nextIdleStatusAction = _translateBlueprints2.nextIdleStatusAction,
      lastIdleStatusAction = _translateBlueprints2.lastIdleStatusAction;

  var _translateBlueprintTy = translateBlueprintTypes({
    START: _constants.START_BLUEPRINT,
    STOP: _constants.STOP_BLUEPRINT,
    NEXT_IDLE_STATUS: _constants.NEXT_IDLE_STATUS_BLUEPRINT,
    LAST_IDLE_STATUS: _constants.LAST_IDLE_STATUS_BLUEPRINT,
    ACTIVITY: _constants.ACTIVITY_BLUEPRINT
  }),
      START = _translateBlueprintTy.START,
      STOP = _translateBlueprintTy.STOP,
      NEXT_IDLE_STATUS = _translateBlueprintTy.NEXT_IDLE_STATUS,
      LAST_IDLE_STATUS = _translateBlueprintTy.LAST_IDLE_STATUS,
      ACTIVITY = _translateBlueprintTy.ACTIVITY;

  var idleStatuses = [_constants.IDLESTATUS_ACTIVE].concat((0, _toConsumableArray3.default)(IDLE_STATUSES));
  var getNextIdleStatus = (0, _states.getNextIdleStatusIn)(idleStatuses);
  var IDLESTATUS_FIRST = getNextIdleStatus(_constants.IDLESTATUS_ACTIVE);
  var IDLESTATUS_LAST = IDLE_STATUSES.slice(-1)[0];

  var nextTimeoutID = null;
  var startDetectionID = null;
  var isStarted = false;
  return function (store) {
    //const idleStore = bisectStore(ROOT_STATE_KEY)(store)
    var _createDetection = (0, _actions.createDetection)(context)(store),
        startActivityDetection = _createDetection.startActivityDetection,
        stopActivityDetection = _createDetection.stopActivityDetection,
        localSync = _createDetection.localSync;

    if (_constants.IS_DEV) {
      (0, _invariant2.default)(startActivityDetection, "createDetection should return startActivityDetection");
      (0, _invariant2.default)(stopActivityDetection, "createDetection should return stopActivityDetection");
      (0, _invariant2.default)(localSync, "localSync should exist");
    }
    return function (next) {
      return function (action) {
        var dispatch = store.dispatch,
            getState = store.getState;


        if (!action.type) return next(action);
        var type = action.type,
            payload = action.payload;


        var scheduleTransition = function scheduleTransition(idleStatus) {
          clearTimeout(nextTimeoutID);
          var delay = dispatch(idleStatusDelay(idleStatus));
          (0, _invariant2.default)(delay, "must return an idle status delay for idleStatus === '" + idleStatus + "'");
          (0, _invariant2.default)(typeof delay === "number", "idle status delay must be a number type for idleStatus === '" + idleStatus + "'");

          var lastActive = new Date().toTimeString();
          var nextMessage = NEXT_IDLE_STATUS + " action continuing after " + delay + " MS delay, lastActive: " + new Date().toTimeString();
          var nextCancelMessage = function nextCancelMessage(cancelledAt) {
            return NEXT_IDLE_STATUS + " action cancelled before " + delay + " MS delay by dispatcher, lastActive: " + new Date().toTimeString() + ", cancelledAt: " + cancelledAt;
          };
          var nextIdleStatus = getNextIdleStatus(idleStatus);
          nextTimeoutID = setTimeout(function () {
            next(action);
            dispatch(idleStatusAction(idleStatus));
            if (nextIdleStatus) {
              dispatch(nextIdleStatusAction(nextIdleStatus));
            } else {
              localSync.trigger(false);
            }
          }, delay);
          return function cancel() {
            clearTimeout(nextTimeoutID);
          };
        };

        if (type === START) {
          if (!isStarted) {
            startActivityDetection();
            localSync.start();
            isStarted = true;
          }
          var result = next(action);
          dispatch(nextIdleStatusAction(IDLESTATUS_FIRST));
          return result;
        }

        if (type === STOP) {
          clearTimeout(nextTimeoutID);
          clearTimeout(startDetectionID);
          if (isStarted) {
            localSync.stop();
            stopActivityDetection();
            isStarted = false;
          }
        }

        if (type === NEXT_IDLE_STATUS) {
          return scheduleTransition(payload.nextIdleStatus);
        }

        if (type === LAST_IDLE_STATUS) {
          clearTimeout(nextTimeoutID);
          dispatch(idleStatusAction(IDLESTATUS_LAST));
        }

        if (type === ACTIVITY) {
          if (thresholds.phaseOffMS) {
            localSync.stop();
            stopActivityDetection();
            startDetectionID = setTimeout(function () {
              startActivityDetection();
              localSync.start();
            }, thresholds.phaseOffMS);
          }

          var _result = next(action);
          if (payload.type !== "local") {
            log.info("Setting local tab to active");
            localSync.trigger(true);
          }
          if (payload.isTransition) {
            dispatch(activeStatusAction);
          }
          dispatch(nextIdleStatusAction(IDLESTATUS_FIRST));
          return _result;
        }
        return next(action);
      };
    };
  };
};

/** Creates middleware from opts including validation in development */
function configureMiddleware(opts) {
  return createMiddleware((0, _context2.default)(opts));
}