"use strict";

import { format as _format } from '../../format_helper';

export default function(value, options) {
    return _format(value, options.format, options.precision /* DEPRECATED_16_1 */);
}
