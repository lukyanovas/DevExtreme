"use strict";

import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import Callbacks from '../../core/utils/callbacks';
import domAdapter from '../dom_adapter';

var window = domAdapter.getWindow();

var resizeCallbacks = (function() {
    var prevSize,
        callbacks = Callbacks(),
        resizeEventHandlerAttached = false,
        originalCallbacksAdd = callbacks.add,
        originalCallbacksRemove = callbacks.remove;

    var formatSize = function() {
        var jqWindow = $(window);

        return {
            width: jqWindow.width(),
            height: jqWindow.height()
        };
    };

    var handleResize = function() {
        var now = formatSize();
        if(now.width === prevSize.width && now.height === prevSize.height) {
            return;
        }

        var changedDimension;
        if(now.width === prevSize.width) {
            changedDimension = 'height';
        }
        if(now.height === prevSize.height) {
            changedDimension = 'width';
        }

        prevSize = now;

        callbacks.fire(changedDimension);
    };
    prevSize = formatSize();

    callbacks.add = function() {
        var result = originalCallbacksAdd.apply(callbacks, arguments);
        var jqWindow = $(window);

        if(!resizeEventHandlerAttached && callbacks.has()) {
            eventsEngine.subscribeGlobal(jqWindow, "resize", handleResize);
            resizeEventHandlerAttached = true;
        }
        return result;
    };

    callbacks.remove = function() {
        var result = originalCallbacksRemove.apply(callbacks, arguments);
        var jqWindow = $(window);

        if(!callbacks.has() && resizeEventHandlerAttached) {
            eventsEngine.off(jqWindow, "resize", handleResize);
            resizeEventHandlerAttached = false;
        }
        return result;
    };

    return callbacks;
})();

var defaultScreenFactorFunc = function(width) {
    if(width < 768) {
        return "xs";
    } else if(width < 992) {
        return "sm";
    } else if(width < 1200) {
        return "md";
    } else {
        return "lg";
    }
};

var getCurrentScreenFactor = function(screenFactorCallback) {
    var screenFactorFunc = screenFactorCallback || defaultScreenFactorFunc;

    return screenFactorFunc($(window).width());
};

export { resizeCallbacks, defaultScreenFactorFunc, getCurrentScreenFactor };
