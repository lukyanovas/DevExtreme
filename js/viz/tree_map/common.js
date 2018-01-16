"use strict";

import { patchFontOptions as _patchFontOptions } from '../core/utils';

export var buildRectAppearance = function(option) {
    var border = option.border || {};
    return { fill: option.color, opacity: option.opacity, "stroke": border.color, "stroke-width": border.width, "stroke-opacity": border.opacity, hatching: option.hatching };
};

export var buildTextAppearance = function(options, filter) {
    return {
        attr: options["stroke-width"] ? {
            stroke: options.stroke, "stroke-width": options["stroke-width"], "stroke-opacity": options["stroke-opacity"],
            filter: filter
        } : {},
        css: _patchFontOptions(options.font)
    };
};
