import createContext from "./context";
import {
  IS_DEV,
  IDLESTATUS_ACTIVE,
  START_BLUEPRINT,
  STOP_BLUEPRINT,
  GOTO_IDLE_STATUS_BLUEPRINT,
  ACTIVITY_BLUEPRINT,
  ACTIVITY_DETECTION_BLUEPRINT,
  NEXT_IDLE_STATUS_BLUEPRINT,
  LAST_IDLE_STATUS_BLUEPRINT,
  ROOT_STATE_KEY
} from "./constants";

/** When context has already been created, it can be shared to middleware component. */
export const createReducer = context => {
  const { initialState, translateBlueprintTypes, IDLE_STATUSES } = context;

  const IDLESTATUS_LAST = IDLE_STATUSES.slice(-1)[0];

  const {
    START,
    STOP,
    GOTO_IDLE_STATUS,
    ACTIVITY,
    ACTIVITY_DETECTION,
    NEXT_IDLE_STATUS,
    LAST_IDLE_STATUS
  } = translateBlueprintTypes({
    START: START_BLUEPRINT,
    STOP: STOP_BLUEPRINT,
    GOTO_IDLE_STATUS: GOTO_IDLE_STATUS_BLUEPRINT,
    ACTIVITY: ACTIVITY_BLUEPRINT,
    ACTIVITY_DETECTION: ACTIVITY_DETECTION_BLUEPRINT,
    NEXT_IDLE_STATUS: NEXT_IDLE_STATUS_BLUEPRINT,
    LAST_IDLE_STATUS: LAST_IDLE_STATUS_BLUEPRINT
  });

  return (state = initialState, action = {}) => {
    const { type, payload } = action;
    switch (type) {
      case START:
        return state.setIn([ROOT_STATE_KEY, "isRunning"], true);
      case STOP:
        return state.setIn([ROOT_STATE_KEY, "isRunning"], false);
      case GOTO_IDLE_STATUS: {
        const { idleStatus } = payload;
        return state
          .setIn([ROOT_STATE_KEY, "idleStatus"], idleStatus)
          .setIn([ROOT_STATE_KEY, "isIdle"], true);
      }
      case ACTIVITY: {
        const { activeStatus, lastActive, lastEvent, timeoutID } = payload;

        return state
          .setIn([ROOT_STATE_KEY, "idleStatus"], activeStatus)
          .setIn([ROOT_STATE_KEY, "lastActive"], lastActive)
          .setIn([ROOT_STATE_KEY, "lastEvent"], lastEvent)
          .setIn([ROOT_STATE_KEY, "timeoutID"], timeoutID)
          .setIn([ROOT_STATE_KEY, "isIdle"], false);
      }

      case ACTIVITY_DETECTION: {
        const { isDetectionRunning } = payload;
        return state.setIn(
          [ROOT_STATE_KEY, "isDetectionRunning"],
          isDetectionRunning
        );
      }
      case NEXT_IDLE_STATUS: {
        const { nextIdleStatus } = payload;
        return state
          .setIn([ROOT_STATE_KEY, "idleStatus"], nextIdleStatus)
          .setIn([ROOT_STATE_KEY, "isIdle"], true);
      }

      case LAST_IDLE_STATUS: {
        const lastIdleStatus = IDLESTATUS_LAST;

        return state
          .setIn([ROOT_STATE_KEY, "idleStatus"], lastIdleStatus)
          .setIn([ROOT_STATE_KEY, "isIdle"], true);
      }

      default:
        return state;
    }
  };
};

/** Creates reducer from opts including validation in development */
export default function configureReducer(opts) {
  return createReducer(createContext(opts));
}
