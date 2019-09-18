"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createReducer = undefined;
exports.default = configureReducer;

var _context = require("./context");

var _context2 = _interopRequireDefault(_context);

var _constants = require("./constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** When context has already been created, it can be shared to middleware component. */
var createReducer = exports.createReducer = function createReducer(context) {
  var initialState = context.initialState,
      translateBlueprintTypes = context.translateBlueprintTypes,
      IDLE_STATUSES = context.IDLE_STATUSES;


  var IDLESTATUS_LAST = IDLE_STATUSES.slice(-1)[0];

  var _translateBlueprintTy = translateBlueprintTypes({
    START: _constants.START_BLUEPRINT,
    STOP: _constants.STOP_BLUEPRINT,
    GOTO_IDLE_STATUS: _constants.GOTO_IDLE_STATUS_BLUEPRINT,
    ACTIVITY: _constants.ACTIVITY_BLUEPRINT,
    ACTIVITY_DETECTION: _constants.ACTIVITY_DETECTION_BLUEPRINT,
    NEXT_IDLE_STATUS: _constants.NEXT_IDLE_STATUS_BLUEPRINT,
    LAST_IDLE_STATUS: _constants.LAST_IDLE_STATUS_BLUEPRINT
  }),
      START = _translateBlueprintTy.START,
      STOP = _translateBlueprintTy.STOP,
      GOTO_IDLE_STATUS = _translateBlueprintTy.GOTO_IDLE_STATUS,
      ACTIVITY = _translateBlueprintTy.ACTIVITY,
      ACTIVITY_DETECTION = _translateBlueprintTy.ACTIVITY_DETECTION,
      NEXT_IDLE_STATUS = _translateBlueprintTy.NEXT_IDLE_STATUS,
      LAST_IDLE_STATUS = _translateBlueprintTy.LAST_IDLE_STATUS;

  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var type = action.type,
        payload = action.payload;

    switch (type) {
      case START:
        return state.setIn([_constants.ROOT_STATE_KEY, "isRunning"], true);
      case STOP:
        return state.setIn([_constants.ROOT_STATE_KEY, "isRunning"], false);
      case GOTO_IDLE_STATUS:
        {
          var idleStatus = payload.idleStatus;

          return state.setIn([_constants.ROOT_STATE_KEY, "idleStatus"], idleStatus).setIn([_constants.ROOT_STATE_KEY, "isIdle"], true);
        }
      case ACTIVITY:
        {
          var activeStatus = payload.activeStatus,
              lastActive = payload.lastActive,
              lastEvent = payload.lastEvent,
              timeoutID = payload.timeoutID;


          return state.setIn([_constants.ROOT_STATE_KEY, "idleStatus"], activeStatus).setIn([_constants.ROOT_STATE_KEY, "lastActive"], lastActive).setIn([_constants.ROOT_STATE_KEY, "lastEvent"], lastEvent).setIn([_constants.ROOT_STATE_KEY, "timeoutID"], timeoutID).setIn([_constants.ROOT_STATE_KEY, "isIdle"], false);
        }

      case ACTIVITY_DETECTION:
        {
          var isDetectionRunning = payload.isDetectionRunning;

          return state.setIn([_constants.ROOT_STATE_KEY, "isDetectionRunning"], isDetectionRunning);
        }
      case NEXT_IDLE_STATUS:
        {
          var nextIdleStatus = payload.nextIdleStatus;

          return state.setIn([_constants.ROOT_STATE_KEY, "idleStatus"], nextIdleStatus).setIn([_constants.ROOT_STATE_KEY, "isIdle"], true);
        }

      case LAST_IDLE_STATUS:
        {
          var lastIdleStatus = IDLESTATUS_LAST;

          return state.setIn([_constants.ROOT_STATE_KEY, "idleStatus"], lastIdleStatus).setIn([_constants.ROOT_STATE_KEY, "isIdle"], true);
        }

      default:
        return state;
    }
  };
};

/** Creates reducer from opts including validation in development */
function configureReducer(opts) {
  return createReducer((0, _context2.default)(opts));
}