"use strict";

import jQuery from 'jquery';
import config from '../../core/config';
var useJQuery = config().useJQuery;

if(jQuery && useJQuery !== false) {
    config({ useJQuery: true });
}

export default function() {
    return jQuery && config().useJQuery;
}
