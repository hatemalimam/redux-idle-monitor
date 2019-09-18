'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/** Lib Constants */
var LIB_NAME = exports.LIB_NAME = 'redux-idle-monitor';

/** Redux state root level key */
var ROOT_STATE_KEY = exports.ROOT_STATE_KEY = 'idle';

var ACTION_PREFIX = exports.ACTION_PREFIX = 'IDLEMONITOR';

/** Action Blueprint Name Constants */
var START_BLUEPRINT = exports.START_BLUEPRINT = 'START';
var STOP_BLUEPRINT = exports.STOP_BLUEPRINT = 'STOP';
var GOTO_IDLE_STATUS_BLUEPRINT = exports.GOTO_IDLE_STATUS_BLUEPRINT = 'GOTO_IDLE_STATUS';

var ACTIVITY_BLUEPRINT = exports.ACTIVITY_BLUEPRINT = 'ACTIVITY';
var ACTIVITY_DETECTION_BLUEPRINT = exports.ACTIVITY_DETECTION_BLUEPRINT = 'ACTIVITY_DETECTION';

var NEXT_IDLE_STATUS_BLUEPRINT = exports.NEXT_IDLE_STATUS_BLUEPRINT = 'NEXT_IDLE_STATUS';
var LAST_IDLE_STATUS_BLUEPRINT = exports.LAST_IDLE_STATUS_BLUEPRINT = 'LAST_IDLE_STATUS';

/** INITIAL IDLE STATUS */
var IDLESTATUS_ACTIVE = exports.IDLESTATUS_ACTIVE = 'ACTIVE';

var IS_DEV = exports.IS_DEV = process.env.NODE_ENV !== 'production';