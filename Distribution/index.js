import { me } from "appbit";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { user } from "user-profile";
var _hrm;
var _lastTimestamp;
var _watchID;
/**
 * Result of an Heart Rate Measure
 */
var HeartReatMeasure = /** @class */ (function () {
    function HeartReatMeasure(heartRate, zone, restingHeartRate) {
        this.heartRate = heartRate;
        this.zone = zone;
        this.restingHeartRate = restingHeartRate;
    }
    return HeartReatMeasure;
}());
export { HeartReatMeasure };
export var last;
/**
 * Callback to the calling application
 */
var _callback;
/**
 * Initialize this module
 * @param callback
 */
export function initialize(callback) {
    if (HeartRateSensor
        && me.permissions.granted("access_heart_rate")
        && me.permissions.granted("access_user_profile")) {
        _callback = callback;
        _hrm = new HeartRateSensor();
        setupEvents();
        start();
        _lastTimestamp = _hrm.timestamp;
    }
    else {
        console.log("Denied Heart Rate or User Profile permissions");
    }
}
/**
 * Read data
 */
function getReading() {
    // Get value only if it is new
    if (_hrm.timestamp === _lastTimestamp)
        return;
    _lastTimestamp = _hrm.timestamp;
    // Get heart rate
    var heartRate = _hrm.heartRate || 0;
    // Cache last values
    last = new HeartReatMeasure(heartRate, user.heartRateZone(heartRate), user.restingHeartRate);
    // Return values
    _callback(last);
}
/**
 * Manage Events
 */
function setupEvents() {
    // Dispay chanded
    display.onchange = function () {
        if (display.on) {
            start();
        }
        else {
            stop();
        }
    };
}
/**
 * Start Heart Rate Measures
 */
export function start() {
    if (!_watchID) {
        _hrm.start();
        getReading();
        _watchID = setInterval(getReading, 1000);
    }
}
/**
 * Stop Heart Rate Measures
 */
export function stop() {
    _hrm.stop();
    if (_watchID !== null)
        clearInterval(_watchID);
    _watchID = null;
}
