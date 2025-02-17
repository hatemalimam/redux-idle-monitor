import invariant from "invariant";
import {
  startBlueprint,
  stopBlueprint,
  resetIdleStatusBlueprint,
  activityBlueprint,
  activityDetectionBlueprint
} from "./blueprints";
import {
  IS_DEV,
  IDLESTATUS_ACTIVE,
  USER_ACTIVE,
  NEXT_IDLE_STATUS,
  RESET_IDLE_STATUS,
  ROOT_STATE_KEY
} from "./constants";
import localsync from "localsync";

const STOP_TYPES = ["pointermove", "MSPointerMove"];
const FILTER_TYPES = ["mousemove"];

const isBrowser = () => typeof window === "object";

/** Detects whether the activity should trigger a redux update */
const createShouldActivityUpdate = ({ log, thresholds }) => store => ({
  type,
  pageX,
  pageY
}) => {
  if (STOP_TYPES.indexOf(type) !== -1) return false;
  if (!FILTER_TYPES.indexOf(type) !== -1) return true;
  /** If last event was not the same event type, trigger an update. */
  const lastActive = store.getState().getIn([ROOT_STATE_KEY, "lastActive"]);
  const lastEvent = store.getState().getIn([ROOT_STATE_KEY, "lastEvent"]);
  if (lastEvent.type !== type) return true;

  /** If last mouse events coordinates were not within mouse threshold, trigger an update. */
  const { x, y } = lastEvent;
  if (
    pageX &&
    pageY &&
    x &&
    y &&
    Math.abs(pageX - x) < thresholds.mouse &&
    Math.abs(pageY - y) < thresholds.mouse
  )
    return false;
  return true;
};

const isRunning = (dispatch, getState) => {
  const isDetectionRunning = getState().getIn([
    ROOT_STATE_KEY,
    "isDetectionRunning"
  ]);
  if (IS_DEV) {
    invariant(
      isDetectionRunning,
      "idle monitor state should have isDetectionRunning defined"
    );
    invariant(
      typeof isDetectionRunning === "boolean",
      "isDetectionRunning should be type boolean"
    );
  }
  return isDetectionRunning;
};

const createLocalSync = ({ log, activity, getIsTransition }) => store => {
  const action = isActive => {
    if (isActive) return { isActive, lastActive: Date.now() };
    else return { isActive };
  };

  const handler = (value, old, url) => {
    log.info({ value, old, url }, "local sync");
    if (value.isActive)
      store.dispatch(
        activity({ type: "local", isTransition: getIsTransition() })
      );
  };
  return localsync("idlemonitor", action, handler);
};

const createActivityDetection = ({
  log,
  thresholds,
  activeEvents,
  activity,
  activityDetection,
  getIsTransition
}) => store => {
  const { dispatch } = store;
  const shouldActivityUpdate = createShouldActivityUpdate({ log, thresholds })(
    store
  );
  /** One of the event listeners triggered an activity occurrence event. This gets spammed */
  const onActivity = e => {
    if (!shouldActivityUpdate(e)) return;
    dispatch(
      activity({
        x: e.pageX,
        y: e.pageY,
        type: e.type,
        isTransition: getIsTransition()
      })
    );
  };

  const startActivityDetection = () => {
    if (isBrowser())
      activeEvents.forEach(x => document.addEventListener(x, onActivity));
    dispatch(activityDetection(true));
  };
  const stopActivityDetection = () => {
    if (isBrowser())
      activeEvents.forEach(x => document.removeEventListener(x, onActivity));
    dispatch(activityDetection(false));
  };
  return { startActivityDetection, stopActivityDetection };
};

export const createDetection = ({
  log,
  activeEvents,
  thresholds,
  translateBlueprints
}) => store => {
  const { activity, activityDetection } = translateBlueprints({
    activity: activityBlueprint,
    activityDetection: activityDetectionBlueprint
  });

  const getIsTransition = () => {
    const idleStatus = store.getState().getIn([ROOT_STATE_KEY, "idleStatus"]);

    return idleStatus !== IDLESTATUS_ACTIVE;
  };

  const {
    startActivityDetection,
    stopActivityDetection
  } = createActivityDetection({
    log,
    thresholds,
    activeEvents,
    activity,
    activityDetection,
    getIsTransition
  })(store);
  const localSync = createLocalSync({ log, activity, getIsTransition })(store);

  invariant(
    startActivityDetection,
    "startActivityDetection should be a return property of createActivityDetection"
  );
  invariant(
    stopActivityDetection,
    "stopActivityDetection should be a return property of createActivityDetection"
  );
  invariant(localSync, "localSync should exist");
  invariant(localSync.start, "localSync.start should exist");
  invariant(localSync.stop, "localSync.stop should exist");
  invariant(localSync.trigger, "localSync.trigger should exist");

  log.info("activity detection starting");

  return { startActivityDetection, stopActivityDetection, localSync };
};
