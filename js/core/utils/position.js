"use strict";

import config from '../config';

var getDefaultAlignment = function(isRtlEnabled) {
    var rtlEnabled = isRtlEnabled || config().rtlEnabled;

    return rtlEnabled ? "right" : "left";
};

export { getDefaultAlignment };
