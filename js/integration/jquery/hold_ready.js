"use strict";

import jQuery from 'jquery';
import themes_callback from '../../ui/themes_callback';
import ready from '../../core/utils/ready';

if(jQuery && !themes_callback.fired()) {
    var holdReady = jQuery.holdReady || jQuery.fn.holdReady;

    holdReady(true);

    themes_callback.add(function() {
        ready(function() {
            holdReady(false);
        });
    });
}
