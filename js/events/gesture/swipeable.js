"use strict";

import swipeEvents from '../swipe';
import eventsEngine from '../../events/core/events_engine';
import DOMComponent from '../../core/dom_component';
import { each } from '../../core/utils/iterator';
import * as eventUtils from '../utils';
import { extend } from '../../core/utils/extend';
import publicComponentUtils from '../../core/utils/public_component';

var DX_SWIPEABLE = "dxSwipeable",
    SWIPEABLE_CLASS = "dx-swipeable",

    ACTION_TO_EVENT_MAP = {
        "onStart": swipeEvents.start,
        "onUpdated": swipeEvents.swipe,
        "onEnd": swipeEvents.end,
        "onCancel": "dxswipecancel"
    };


var Swipeable = DOMComponent.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            elastic: true,
            immediate: false,
            direction: "horizontal",
            itemSizeFunc: null,
            onStart: null,
            onUpdated: null,
            onEnd: null,
            onCancel: null
        });
    },

    _render: function() {
        this.callBase();

        this.$element().addClass(SWIPEABLE_CLASS);
        this._attachEventHandlers();
    },

    _attachEventHandlers: function() {
        this._detachEventHandlers();

        if(this.option("disabled")) {
            return;
        }

        var NAME = this.NAME;

        this._createEventData();

        each(ACTION_TO_EVENT_MAP, (function(actionName, eventName) {
            var action = this._createActionByOption(actionName, { context: this });

            eventName = eventUtils.addNamespace(eventName, NAME);

            eventsEngine.on(this.$element(), eventName, this._eventData, function(e) {
                return action({ event: e });
            });
        }).bind(this));
    },

    _createEventData: function() {
        this._eventData = {
            elastic: this.option("elastic"),
            itemSizeFunc: this.option("itemSizeFunc"),
            direction: this.option("direction"),
            immediate: this.option("immediate")
        };
    },

    _detachEventHandlers: function() {
        eventsEngine.off(this.$element(), "." + DX_SWIPEABLE);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "disabled":
            case "onStart":
            case "onUpdated":
            case "onEnd":
            case "onCancel":
            case "elastic":
            case "immediate":
            case "itemSizeFunc":
            case "direction":
                this._detachEventHandlers();
                this._attachEventHandlers();
                break;
            case "rtlEnabled":
                break;
            default:
                this.callBase(args);
        }

    }

});

publicComponentUtils.name(Swipeable, DX_SWIPEABLE);

export default Swipeable;
