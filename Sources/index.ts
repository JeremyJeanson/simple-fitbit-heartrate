import { me } from "appbit";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { user, DefaultZone, UserDefinedZone } from "user-profile";

let _hrm: HeartRateSensor;
let _lastTimestamp: number | null;
let _watchID: number | null;

/**
 * Result of an Heart Rate Measure
 */
export class HeartReatMeasure {
  /**
   * Hear rate (bpm)
   */
  heartRate: number;
  /**
   * Current heart rate Zone (combine default and custom zones)
   */
  zone: DefaultZone | UserDefinedZone;
  /**
   * Resting heart rate
   */
  restingHeartRate: number | undefined;
  constructor(heartRate: number, zone: DefaultZone | UserDefinedZone, restingHeartRate: number | undefined) {
    this.heartRate = heartRate;
    this.zone = zone;
    this.restingHeartRate = restingHeartRate;
  }
}
export let last: HeartReatMeasure | undefined;

declare type Callback = (value: HeartReatMeasure | undefined) => void;

/**
 * Callback to the calling application
 */
let _callback: Callback;

/**
 * Initialize this module
 * @param callback 
 */
export function initialize(callback: Callback): void {
  if (HeartRateSensor
    && me.permissions.granted("access_heart_rate")
    && me.permissions.granted("access_user_profile")) {
    _callback = callback;
    _hrm = new HeartRateSensor();
    setupEvents();
    start();
    _lastTimestamp = _hrm.timestamp;
  } else {
    console.log("Denied Heart Rate or User Profile permissions");
  }
}

/**
 * Read data
 */
function getReading(): void {
  // Get value only if it is new
  if (_hrm.timestamp === _lastTimestamp) return;
  _lastTimestamp = _hrm.timestamp;
  // Get heart rate
  const heartRate = _hrm.heartRate || 0;
  // Cache last values
  last = new HeartReatMeasure(
    heartRate,
    user.heartRateZone(heartRate),
    user.restingHeartRate);

  // Return values
  _callback(last);
}

/**
 * Manage Events
 */
function setupEvents(): void {
  // Dispay chanded
  display.onchange = () => {
    if (display.on) {
      start();
    } else {
      stop();
    }
  };
}

/**
 * Start Heart Rate Measures
 */
export function start(): void {
  if (!_watchID) {
    _hrm.start();
    getReading();
    _watchID = setInterval(getReading, 1000);
  }
}

/**
 * Stop Heart Rate Measures
 */
export function stop(): void {
  _hrm.stop();
  if (_watchID !== null) clearInterval(_watchID);
  _watchID = null;
}