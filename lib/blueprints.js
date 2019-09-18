'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastIdleStatusBlueprint = exports.nextIdleStatusBlueprint = exports.publicBlueprints = exports.activityDetectionBlueprint = exports.activityBlueprint = exports.gotoIdleStatusBlueprint = exports.stopBlueprint = exports.startBlueprint = undefined;

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _reduxBlueprint = require('redux-blueprint');

var _constants = require('./constants');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var startBlueprint = exports.startBlueprint = (0, _reduxBlueprint.createBlueprint)(_constants.START_BLUEPRINT);
var stopBlueprint = exports.stopBlueprint = (0, _reduxBlueprint.createBlueprint)(_constants.STOP_BLUEPRINT);
var gotoIdleStatusBlueprint = exports.gotoIdleStatusBlueprint = (0, _reduxBlueprint.createBlueprint)(_constants.GOTO_IDLE_STATUS_BLUEPRINT, function (idleStatus) {
  return { idleStatus: idleStatus };
});

var activityBlueprint = exports.activityBlueprint = (0, _reduxBlueprint.createBlueprint)(_constants.ACTIVITY_BLUEPRINT, function (_ref) {
  var x = _ref.x,
      y = _ref.y,
      type = _ref.type,
      isTransition = _ref.isTransition;
  return { activeStatus: _constants.IDLESTATUS_ACTIVE, lastActive: +new Date(), lastEvent: { x: x, y: y, type: type }, isTransition: isTransition };
});
var activityDetectionBlueprint = exports.activityDetectionBlueprint = (0, _reduxBlueprint.createBlueprint)(_constants.ACTIVITY_DETECTION_BLUEPRINT, function (isDetectionRunning) {
  return { isDetectionRunning: isDetectionRunning };
});

var publicBlueprints = exports.publicBlueprints = { start: startBlueprint, stop: stopBlueprint, gotoIdleStatus: gotoIdleStatusBlueprint };

var nextIdleStatusBlueprint = exports.nextIdleStatusBlueprint = (0, _reduxBlueprint.createBlueprint)(_constants.NEXT_IDLE_STATUS_BLUEPRINT, function (nextIdleStatus) {
  (0, _invariant2.default)(nextIdleStatus, 'nextIdleStatus must be defined');
  return { nextIdleStatus: nextIdleStatus };
});

var lastIdleStatusBlueprint = exports.lastIdleStatusBlueprint = (0, _reduxBlueprint.createBlueprint)(_constants.LAST_IDLE_STATUS_BLUEPRINT);