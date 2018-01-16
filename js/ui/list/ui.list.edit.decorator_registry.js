"use strict";

import { extend } from '../../core/utils/extend';

export var registry = {};

export var register = function(option, type, decoratorClass) {
    var decoratorsRegistry = exports.registry;

    var decoratorConfig = {};
    decoratorConfig[option] = decoratorsRegistry[option] ? decoratorsRegistry[option] : {};
    decoratorConfig[option][type] = decoratorClass;

    decoratorsRegistry = extend(decoratorsRegistry, decoratorConfig);
};
