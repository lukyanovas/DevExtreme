"use strict";

import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import Widget from '../widget/ui.widget';
import { extend } from '../../core/utils/extend';
import * as eventUtils from '../../events/utils';
import pointerEvents from '../../events/pointer';
import feedbackEvents from '../../events/core/emitter.feedback';
import holdEvent from '../../events/hold';
import { Deferred } from '../../core/utils/deferred';
import domAdapter from '../../core/dom_adapter';

var document = domAdapter.getWindow().document;

var SPIN_CLASS = "dx-numberbox-spin",
    SPIN_BUTTON_CLASS = "dx-numberbox-spin-button",

    SPIN_HOLD_DELAY = 100,

    NUMBER_BOX = 'dxNumberBox',
    POINTERUP_EVENT_NAME = eventUtils.addNamespace(pointerEvents.up, NUMBER_BOX),
    POINTERCANCEL_EVENT_NAME = eventUtils.addNamespace(pointerEvents.cancel, NUMBER_BOX);

var SpinButton = Widget.inherit({

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            direction: "up",
            onChange: null,
            activeStateEnabled: true,
            hoverStateEnabled: true
        });
    },

    _render: function() {
        this.callBase();

        var $element = this.$element(),
            direction = SPIN_CLASS + "-" + this.option("direction");
        var eventName = eventUtils.addNamespace(pointerEvents.down, this.NAME);

        $element
            .addClass(SPIN_BUTTON_CLASS)
            .addClass(direction);

        eventsEngine.off($element, eventName);
        eventsEngine.on($element, eventName, this._spinDownHandler.bind(this));

        this._spinIcon = $("<div>").addClass(direction + "-icon").appendTo(this.$element());

        this._spinChangeHandler = this._createActionByOption("onChange");
    },

    _spinDownHandler: function(e) {
        e.preventDefault();

        this._clearTimer();

        eventsEngine.on(this.$element(), holdEvent.name, (function() {
            this._feedBackDeferred = new Deferred();
            feedbackEvents.lock(this._feedBackDeferred);
            this._spinChangeHandler({ event: e });
            this._holdTimer = setInterval(this._spinChangeHandler, SPIN_HOLD_DELAY, { event: e });
        }).bind(this));

        eventsEngine.on(document, POINTERUP_EVENT_NAME, this._clearTimer.bind(this));
        eventsEngine.on(document, POINTERCANCEL_EVENT_NAME, this._clearTimer.bind(this));

        this._spinChangeHandler({ event: e });
    },

    _dispose: function() {
        this._clearTimer();
        this.callBase();
    },

    _clearTimer: function() {
        eventsEngine.off(this.$element(), holdEvent.name);

        eventsEngine.off(document, POINTERUP_EVENT_NAME);
        eventsEngine.off(document, POINTERCANCEL_EVENT_NAME);

        if(this._feedBackDeferred) {
            this._feedBackDeferred.resolve();
        }
        if(this._holdTimer) {
            clearInterval(this._holdTimer);
        }
    },

    _optionChanged: function(args) {
        switch(args.name) {
            case "onChange":
            case "direction":
                this._invalidate();
                break;
            default:
                this.callBase(args);
        }
    }
});

export default SpinButton;
