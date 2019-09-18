'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = configure;

var _context = require('./context');

var _context2 = _interopRequireDefault(_context);

var _reducer = require('./reducer');

var _blueprints = require('./blueprints');

var _middleware = require('./middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function configure(appOpts) {
  var context = (0, _context2.default)(appOpts);
  var translateBlueprints = context.translateBlueprints;

  var actions = translateBlueprints(_blueprints.publicBlueprints);
  return { reducer: (0, _reducer.createReducer)(context),
    middleware: (0, _middleware.createMiddleware)(context),
    actions: actions
  };
}