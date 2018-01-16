"use strict";

import $ from '../core/renderer';
import eventsEngine from './core/events_engine';
import errors from '../core/errors';
import { focused } from '../ui/widget/selectors';
import { extend } from '../core/utils/extend';
import { each } from '../core/utils/iterator';

var eventSource = (function() {
    var EVENT_SOURCES_REGEX = {
        "dx": /^dx/i,
        "mouse": /(mouse|wheel)/i,
        "touch": /^touch/i,
        "keyboard": /^key/i,
        "pointer": /^(ms)?pointer/i
    };

    return function(e) {
        var result = "other";

        each(EVENT_SOURCES_REGEX, function(key) {
            if(this.test(e.type)) {
                result = key;
                return false;
            }
        });

        return result;
    };
})();


var isDxEvent = function(e) {
    return eventSource(e) === "dx";
};

var isNativeMouseEvent = function(e) {
    return eventSource(e) === "mouse";
};

var isNativeTouchEvent = function(e) {
    return eventSource(e) === "touch";
};

var isPointerEvent = function(e) {
    return eventSource(e) === "pointer";
};

var isMouseEvent = function(e) {
    return isNativeMouseEvent(e) || ((isPointerEvent(e) || isDxEvent(e)) && e.pointerType === "mouse");
};

var isTouchEvent = function(e) {
    return isNativeTouchEvent(e) || ((isPointerEvent(e) || isDxEvent(e)) && e.pointerType === "touch");
};

var isKeyboardEvent = function(e) {
    return eventSource(e) === "keyboard";
};

var isFakeClickEvent = function(e) {
    return e.screenX === 0 && !e.offsetX && e.pageX === 0;
};


var eventData = function(e) {
    return {
        x: e.pageX,
        y: e.pageY,
        time: e.timeStamp
    };
};

var eventDelta = function(from, to) {
    return {
        x: to.x - from.x,
        y: to.y - from.y,
        time: to.time - from.time || 1
    };
};


var hasTouches = function(e) {
    if(isNativeTouchEvent(e)) {
        return (e.originalEvent.touches || []).length;
    }
    if(isDxEvent(e)) {
        return (e.pointers || []).length;
    }
    return 0;
};

var needSkipEvent = function(e) {
    // TODO: this checking used in swipeable first move handler. is it correct?
    var $target = $(e.target);
    var touchInInput = $target.is("input, textarea, select");

    if($target.is(".dx-skip-gesture-event *, .dx-skip-gesture-event")) {
        return true;
    }
    if(e.type === 'dxmousewheel') {
        return $target.is("input[type='number'], textarea, select") && $target.is(':focus');
    }
    if(isMouseEvent(e)) {
        return touchInInput || e.which > 1; // only left mouse button
    }
    if(isTouchEvent(e)) {
        return touchInInput && focused($target);
    }
};


var fixMethod = function(e) { return e; };
var setEventFixMethod = function(func) {
    fixMethod = func;
};
var copyEvent = function(originalEvent) {
    return fixMethod(eventsEngine.Event(originalEvent, originalEvent), originalEvent);
};

var createEvent = function(originalEvent, args) {
    var event = copyEvent(originalEvent);

    if(args) {
        extend(event, args);
    }

    return event;
};

var fireEvent = function(props) {
    var event = createEvent(props.originalEvent, props);
    eventsEngine.trigger(props.delegateTarget || event.target, event);
    return event;
};


var addNamespace = function(eventNames, namespace) {
    if(!namespace) {
        throw errors.Error("E0017");
    }

    if(typeof eventNames === "string") {
        if(eventNames.indexOf(" ") === -1) {
            return eventNames + "." + namespace;
        }
        return addNamespace(eventNames.split(/\s+/g), namespace);
    }

    each(eventNames, function(index, eventName) {
        eventNames[index] = eventName + "." + namespace;
    });

    return eventNames.join(" ");
};


export {
    eventSource,
    isPointerEvent,
    isMouseEvent,
    isTouchEvent,
    isKeyboardEvent,

    isFakeClickEvent,

    hasTouches,
    eventData,
    eventDelta,
    needSkipEvent,

    createEvent,
    fireEvent,

    addNamespace,
    setEventFixMethod
};
