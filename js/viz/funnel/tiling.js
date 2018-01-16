"use strict";

import { normalizeEnum as _normalizeEnum } from '../core/utils';

var algorithms = {}, defaultAlgorithm;

export var getAlgorithm = function(name) {
    return algorithms[_normalizeEnum(name)] || defaultAlgorithm;
};

export var addAlgorithm = function(name, callback, setDefault) {
    algorithms[name] = callback;

    if(setDefault) {
        defaultAlgorithm = algorithms[name];
    }
};
