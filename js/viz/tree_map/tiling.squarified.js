"use strict";

import _squarify from './tiling.squarified.base';

var _max = Math.max;

function accumulate(total, current) {
    return _max(total, current);
}

function squarified(data) {
    return _squarify(data, accumulate, false);
}

require("./tiling").addAlgorithm("squarified", squarified);
export default squarified;
