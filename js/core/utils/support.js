"use strict";

import { inArray } from './array';
import devices from '../devices';
import * as styleUtils from './style';
import domAdapter from '../dom_adapter';

var window = domAdapter.getWindow(), document = window.document;

var transitionEndEventNames = {
    'webkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'msTransition': 'MsTransitionEnd',
    'transition': 'transitionend'
};

var supportProp = function(prop) {
    return !!styleUtils.styleProp(prop);
};

var isNativeScrollingSupported = function() {
    var realDevice = devices.real(),
        realPlatform = realDevice.platform,
        realVersion = realDevice.version,
        isObsoleteAndroid = (realVersion && realVersion[0] < 4 && realPlatform === "android"),
        isNativeScrollDevice = !isObsoleteAndroid && inArray(realPlatform, ["ios", "android", "win"]) > -1 || realDevice.mac;

    return isNativeScrollDevice;
};

var inputType = function(type) {
    if(type === "text") {
        return true;
    }

    var input = document.createElement("input");
    try {
        input.setAttribute("type", type);
        input.value = "wrongValue";
        return !input.value;
    } catch(e) {
        return false;
    }
};

var touchEvents = "ontouchstart" in window && !('callPhantom' in window),
    pointerEvents = !!window.navigator.pointerEnabled || !!window.navigator.msPointerEnabled,
    touchPointersPresent = !!window.navigator.maxTouchPoints || !!window.navigator.msMaxTouchPoints;

export var touch = touchEvents || pointerEvents && touchPointersPresent;
export var transition = supportProp("transition");
export var transitionEndEventName = transitionEndEventNames[styleUtils.styleProp("transition")];
export var animation = supportProp("animation");
export var nativeScrolling = isNativeScrollingSupported();
export var styleProp = styleUtils.styleProp;
export var stylePropPrefix = styleUtils.stylePropPrefix;
export var hasKo = !!window.ko;
export { touchEvents, pointerEvents, supportProp, inputType };
