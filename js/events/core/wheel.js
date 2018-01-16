"use strict";

import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import registerEvent from './event_registrator';
import * as eventUtils from '../utils';
import domAdapter from '../../core/dom_adapter';

var document = domAdapter.getWindow().document;

var EVENT_NAME = "dxmousewheel",
    EVENT_NAMESPACE = "dxWheel";

var wheelEvent = document["onwheel"] !== undefined ? "wheel" : "mousewheel";

var wheel = {

    setup: function(element) {
        var $element = $(element);
        eventsEngine.on($element, eventUtils.addNamespace(wheelEvent, EVENT_NAMESPACE), wheel._wheelHandler.bind(wheel));
    },

    teardown: function(element) {
        eventsEngine.off(element, "." + EVENT_NAMESPACE);
    },

    _wheelHandler: function(e) {
        var delta = this._getWheelDelta(e.originalEvent);

        eventUtils.fireEvent({
            type: EVENT_NAME,
            originalEvent: e,
            delta: delta,
            pointerType: "mouse"
        });

        e.stopPropagation();
    },

    _getWheelDelta: function(event) {
        return event.wheelDelta
            ? event.wheelDelta
            : -event.deltaY * 30;
    }

};

registerEvent(EVENT_NAME, wheel);

export var name = EVENT_NAME;
