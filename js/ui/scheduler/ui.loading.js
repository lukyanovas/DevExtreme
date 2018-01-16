"use strict";

import $ from '../../core/renderer';
import * as viewPortUtils from '../../core/utils/view_port';
import LoadPanel from '../load_panel';
import { Deferred } from '../../core/utils/deferred';

var loading = null;

var createLoadPanel = function(options) {
    return new LoadPanel($("<div>")
        .appendTo(options && options.container || viewPortUtils.value()),
        options);
};

var removeLoadPanel = function() {
    if(!loading) {
        return;
    }
    loading.$element().remove();
    loading = null;
};

export var show = function(options) {
    removeLoadPanel();
    loading = createLoadPanel(options);
    return loading.show();
};

export var hide = function() {
    //todo: hot fix for case without viewport

    if(!loading) {
        return new Deferred().resolve();
    }
    return loading
        .hide()
        .done(removeLoadPanel)
        .promise();
};
