import { DefaultZone, UserDefinedZone } from "user-profile";
/**
 * Result of an Heart Rate Measure
 */
export declare class HeartReatMeasure {
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
    constructor(heartRate: number, zone: DefaultZone | UserDefinedZone, restingHeartRate: number | undefined);
}
export declare let last: HeartReatMeasure | undefined;
declare type Callback = (value: HeartReatMeasure | undefined) => void;
/**
 * Initialize this module
 * @param callback
 */
export declare function initialize(callback: Callback): void;
/**
 * Start Heart Rate Measures
 */
export declare function start(): void;
/**
 * Stop Heart Rate Measures
 */
export declare function stop(): void;
export {};
