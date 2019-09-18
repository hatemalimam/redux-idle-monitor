'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getTimeStamp = exports.getTimeStamp = function getTimeStamp() {
  return new Date().toTimeString();
};

var getActiveEvents = exports.getActiveEvents = function getActiveEvents() {
  return ['mousemove', 'keydown', 'wheel', 'DOMMouseScroll', 'mouseWheel', 'mousedown', 'touchstart', 'touchmove', 'MSPointerDown', 'MSPointerMove'];
};

var getUseFastState = exports.getUseFastState = function getUseFastState() {
  return true;
};
var getUseLocalState = exports.getUseLocalState = function getUseLocalState() {
  return true;
};
var getUseWebRTCState = exports.getUseWebRTCState = function getUseWebRTCState() {
  return true;
};
var getUseWebSocketsState = exports.getUseWebSocketsState = function getUseWebSocketsState() {
  return true;
};

var getThresholds = exports.getThresholds = function getThresholds() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$mouse = _ref.mouse,
      mouse = _ref$mouse === undefined ? 20 : _ref$mouse,
      _ref$phaseOffMS = _ref.phaseOffMS,
      phaseOffMS = _ref$phaseOffMS === undefined ? 2000 : _ref$phaseOffMS,
      _ref$phaseOnMS = _ref.phaseOnMS,
      phaseOnMS = _ref$phaseOnMS === undefined ? 0 : _ref$phaseOnMS;

  return { mouse: mouse, phaseOffMS: phaseOffMS, phaseOnMS: phaseOnMS };
};

var getLevel = exports.getLevel = function getLevel() {
  return 'error';
};