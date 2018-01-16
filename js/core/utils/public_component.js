"use strict";

import dataUtils from '../../core/element_data';
import eventsEngine from '../../events/core/events_engine';
import WeakMap from '../polyfills/weak_map';
import { isDefined } from './type';
import removeEvent from '../remove_event';

var COMPONENT_NAMES_DATA_KEY = "dxComponents",
    ANONYMOUS_COMPONENT_DATA_KEY = "dxPrivateComponent";

var componentNames = new WeakMap(),
    nextAnonymousComponent = 0;

var getName = exports.name = function(componentClass, newName) {
    if(isDefined(newName)) {
        componentNames.set(componentClass, newName);
        return;
    }

    if(!componentNames.has(componentClass)) {
        var generatedName = ANONYMOUS_COMPONENT_DATA_KEY + nextAnonymousComponent++;
        componentNames.set(componentClass, generatedName);
        return generatedName;
    }

    return componentNames.get(componentClass);
};

export var attachInstanceToElement = function($element, componentInstance, disposeFn) {
    var data = dataUtils.data($element.get(0)),
        name = getName(componentInstance.constructor);

    data[name] = componentInstance;

    if(disposeFn) {
        eventsEngine.one($element, removeEvent, function() {
            disposeFn.call(componentInstance);
        });
    }

    if(!data[COMPONENT_NAMES_DATA_KEY]) {
        data[COMPONENT_NAMES_DATA_KEY] = [];
    }

    data[COMPONENT_NAMES_DATA_KEY].push(name);
};

export var getInstanceByElement = function($element, componentClass) {
    var name = getName(componentClass);

    return dataUtils.data($element.get(0), name);
};
