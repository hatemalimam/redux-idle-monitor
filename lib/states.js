"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getNextIdleStatusIn = exports.getNextIdleStatusIn = function getNextIdleStatusIn(idleStatuses) {
  return function (idleStatus) {
    var nextIdleStatusIndex = idleStatuses.indexOf(idleStatus) + 1;
    if (nextIdleStatusIndex < idleStatuses.length) return idleStatuses[nextIdleStatusIndex];
  };
};