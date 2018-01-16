"use strict";

import hardwareBackFactory from '../core/utils/callbacks';
const hardwareBack = hardwareBackFactory();

/**
 * @name processHardwareBackButton
 * @publicName processHardwareBackButton()
 * @namespace DevExpress
 * @module mobile/process_hardware_back_button
 * @export default
 */
export default function() {
    hardwareBack.fire();
}

export var processCallback = hardwareBack;
