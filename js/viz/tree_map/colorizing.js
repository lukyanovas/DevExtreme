"use strict";

import { normalizeEnum as _normalizeEnum } from '../core/utils';
import { noop as _noop } from '../../core/utils/common';

var colorizers = {}, defaultColorizerName;

function wrapLeafColorGetter(getter) {
    return function(node) {
        return !node.isNode() ? getter(node) : undefined;
    };
}

function wrapGroupColorGetter(getter) {
    return function(node) {
        var parent = !node.isNode() && node.parent;

        return parent ? (parent._groupColor = parent._groupColor || getter(parent)) : undefined;
    };
}

export var getColorizer = function(options, themeManager, root) {
    var type = _normalizeEnum(options.type || defaultColorizerName),
        colorizer = colorizers[type] && colorizers[type](options, themeManager, root);

    return colorizer ? (options.colorizeGroups ? wrapGroupColorGetter : wrapLeafColorGetter)(colorizer) : _noop;
};

export var addColorizer = function(name, colorizer) {
    colorizers[name] = colorizer;
};

export var setDefaultColorizer = function(name) {
    defaultColorizerName = name;
};

function getValueAsColorCode(node) {
    return node.value;
}

function createColorCodeGetter(colorCodeField) {
    return function(node) {
        return Number(node.data[colorCodeField]);
    };
}

export var createColorCodeGetter = function(options) {
    return options.colorCodeField ? createColorCodeGetter(options.colorCodeField) : getValueAsColorCode;
};
