"use strict";

import $ from '../../core/renderer';
import Tooltip from './tooltip';
import { extend } from '../../core/utils/extend';
import { Deferred } from '../../core/utils/deferred';
import * as viewPortUtils from '../../core/utils/view_port';

var tooltip = null;
var removeTooltipElement = null;

var createTooltip = function(options) {
    options = extend({ position: "top" }, options);

    var content = options.content;
    delete options.content;

    var $tooltip = $("<div>")
        .html(content)
        .appendTo(viewPortUtils.value());

    removeTooltipElement = function() {
        $tooltip.remove();
    };

    tooltip = new Tooltip($tooltip, options);
};

var removeTooltip = function() {
    if(!tooltip) {
        return;
    }

    removeTooltipElement();
    tooltip = null;
};

export var show = function(options) {
    removeTooltip();
    createTooltip(options);
    return tooltip.show();
};

export var hide = function() {
    if(!tooltip) {
        return new Deferred().resolve();
    }

    return tooltip.hide()
        .done(removeTooltip)
        .promise();
};
