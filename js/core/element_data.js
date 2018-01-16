"use strict";

import WeakMap from './polyfills/weak_map';
import domAdapter from './dom_adapter';
import eventsEngine from '../events/core/events_engine';
import MemorizedCallbacks from './memorized_callbacks';


var Element = domAdapter.getWindow().Element;
var dataMap = new WeakMap();
var strategy;

var strategyChanging = new MemorizedCallbacks();
var beforeCleanData = function() {};
var afterCleanData = function() {};

var setDataStrategy = function(value) {
    strategyChanging.fire(value);

    strategy = value;

    var cleanData = strategy.cleanData;

    strategy.cleanData = function(nodes) {
        beforeCleanData(nodes);

        var result = cleanData.call(this, nodes);

        afterCleanData(nodes);

        return result;
    };
};

setDataStrategy({
    data: function() {
        var element = arguments[0];
        var key = arguments[1];
        var value = arguments[2];

        if(!element) return;

        var elementData = dataMap.get(element);

        if(!elementData) {
            elementData = {};
            dataMap.set(element, elementData);
        }

        if(key === undefined) {
            return elementData;
        }

        if(arguments.length === 2) {
            return elementData[key];
        }

        elementData[key] = value;
        return value;
    },

    removeData: function(element, key) {
        if(!element) return;
        if(key === undefined) {
            dataMap.delete(element);
        } else {
            var elementData = dataMap.get(element);
            if(elementData) {
                delete elementData[key];
            }
        }
    },

    cleanData: function(elements) {
        for(var i = 0; i < elements.length; i++) {
            eventsEngine.off(elements[i]);
            dataMap.delete(elements[i]);
        }
    }
});

var getDataStrategy = function() {
    return strategy;
};

var data = function() {
    return strategy.data.apply(this, arguments);
};

var beforeCleanDataCallback = function(callback) {
    beforeCleanData = callback;
};

var afterCleanDataCallback = function(callback) {
    afterCleanData = callback;
};

var cleanData = function(nodes) {
    return strategy.cleanData.call(this, nodes);
};

var removeData = function(element, key) {
    return strategy.removeData.call(this, element, key);
};

var cleanDataRecursive = function(element, cleanSelf) {
    if(!(element instanceof Element)) {
        return;
    }

    var childElements = element.getElementsByTagName("*");

    strategy.cleanData(childElements);

    if(cleanSelf) {
        strategy.cleanData([element]);
    }
};

export { cleanData, removeData, cleanDataRecursive, beforeCleanDataCallback as beforeCleanData, afterCleanDataCallback as afterCleanData, getDataStrategy, data, setDataStrategy, strategyChanging };
