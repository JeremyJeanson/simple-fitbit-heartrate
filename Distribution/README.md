[![npm](https://img.shields.io/npm/dw/simple-fitbit-heartrate.svg?logo=npm&label=npm%20version)](https://www.npmjs.com/package/simple-fitbit-heartrate)

# Introduction
The goal of this project is to simplify access to the heart rate measures inside Fitbit OS applications.

It was built to do all this work easier and reduce the need to update the UI and calculations. Less you have to calculate something or update the UI and more you will reduce the impact of your application on the battery consumption.

# Features
This module includes many features to help developers :
- Get heart rate values each second.
- Get values as a single object `HeartReatMeasure`.
- The `HeartReatMeasure` is deined only when the module have new values to share to the fitbit application.
- Type definitions for TypScript or JavaScript (with comments to visualize the documentation when you are coding).

# Data structure
Data returned by the module respect the `HeartReatMeasure` interface.
```ts
interface HeartReatMeasure {
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
}
```

# Installation

## 1. Install the module

You could use a any package manager to install this module. it was tested with npm and pnpm.

```sh
npm install simple-fitbit-heartrate --save-dev
```

## 2. Request user's permissions

Your application should have access to :
- `access_heart_rate` : requested to obtain heart rate of the user.
- `access_user_profile`: requested for user custom zones.

Your `package.json` should be like this (you could request more permissions, it is not a problem) : 

Exemple :
```json
{
    "requestedPermissions": [
        "access_heart_rate",
        "access_user_profile"]
}
```
If permissions are not well set, you will not have exceptions :
- The callback method will return `undefined`.

## 3. Initialize the device app

Inside the `app` folder the `index.ts` file have to :
- Import the module.
- Initialize the module with the method to call when UI should be updated with new values.

Exemple :
```ts
import * as simpleHeartrate from "simple-fitbit-heartrate";
// initialize
simpleHeartrate.initialize(updateHeartrate);
```

## 4. Use and get activities

The `updateHeartrate` could be like this:

Exemple :
```ts
// Update heart rate informations
function updateHeartrate(value: simpleHeartrate.HeartReatMeasure | undefined): void {
  if (value === undefined) return;
  // Zones
  imageHrm.href = value.zone === "out-of-range"
    ? "images/stat_hr_open_48px.png"
    : "images/stat_hr_solid_48px.png";

  text.text = value.heartRate.toString();
}
```

## 5. Refresh / update

This module has logic to periodic refresh (each second). It try to get measures only when display is on.

## 6. Bonus

This modul expose :
- `last` expose the last measure (it use the `HeartReatMeasure` interface).
- `start()` and `stop()` to use with AOD.

# Contribute or report issues

You can report any issue via GitHub, if you found one, please report it!
This code was open to be shared and improved. If you have an idea, tell it or send a pull request.
Keep in mind that this module is built for small devices. It does not have the goal to be a Swiss knife with hundreds of functions. It is why it is simple as possible.

# Compilation

This module was built with TypeScript. It uses Typescript to generate JavaScript files that are imported by the Fitbit SDK.
It includes the following npm scripts to:
- build (generate JavaScript files and copy all requested files to the `./distribution` directory).
- clean (remove generated files from the `./distribution` directory).
- lint (code quality).

If you change exported methods or class, think to use `build` to update those files.