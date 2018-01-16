"use strict";

import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { noop } from '../../core/utils/common';
import Class from '../../core/class';
import swipeEvents from '../../events/swipe';
import * as eventUtils from '../../events/utils';


var LIST_EDIT_DECORATOR = "dxListEditDecorator",
    SWIPE_START_EVENT_NAME = eventUtils.addNamespace(swipeEvents.start, LIST_EDIT_DECORATOR),
    SWIPE_UPDATE_EVENT_NAME = eventUtils.addNamespace(swipeEvents.swipe, LIST_EDIT_DECORATOR),
    SWIPE_END_EVENT_NAME = eventUtils.addNamespace(swipeEvents.end, LIST_EDIT_DECORATOR);

var EditDecorator = Class.inherit({

    ctor: function(list) {
        this._list = list;

        this._init();
    },

    _init: noop,

    _shouldHandleSwipe: false,

    _attachSwipeEvent: function(config) {
        var swipeConfig = {
            itemSizeFunc: (function() {
                if(this._clearSwipeCache) {
                    this._itemWidthCache = this._list.$element().width();
                    this._clearSwipeCache = false;
                }
                return this._itemWidthCache;
            }).bind(this)
        };

        eventsEngine.on(config.$itemElement, SWIPE_START_EVENT_NAME, swipeConfig, this._itemSwipeStartHandler.bind(this));
        eventsEngine.on(config.$itemElement, SWIPE_UPDATE_EVENT_NAME, this._itemSwipeUpdateHandler.bind(this));
        eventsEngine.on(config.$itemElement, SWIPE_END_EVENT_NAME, this._itemSwipeEndHandler.bind(this));
    },

    _itemSwipeStartHandler: function(e) {
        var $itemElement = $(e.currentTarget);
        if($itemElement.is(".dx-state-disabled, .dx-state-disabled *")) {
            e.cancel = true;
            return;
        }

        this._swipeStartHandler($itemElement, e);
    },

    _itemSwipeUpdateHandler: function(e) {
        var $itemElement = $(e.currentTarget);

        this._swipeUpdateHandler($itemElement, e);
    },

    _itemSwipeEndHandler: function(e) {
        var $itemElement = $(e.currentTarget);

        this._swipeEndHandler($itemElement, e);

        this._clearSwipeCache = true;
    },

    beforeBag: noop,

    afterBag: noop,

    _commonOptions: function() {
        return {
            activeStateEnabled: this._list.option("activeStateEnabled"),
            hoverStateEnabled: this._list.option("hoverStateEnabled"),
            focusStateEnabled: this._list.option("focusStateEnabled")
        };
    },

    modifyElement: function(config) {
        if(this._shouldHandleSwipe) {
            this._attachSwipeEvent(config);
            this._clearSwipeCache = true;
        }
    },

    afterRender: noop,

    handleClick: noop,

    handleContextMenu: noop,

    _swipeStartHandler: noop,

    _swipeUpdateHandler: noop,

    _swipeEndHandler: noop,

    visibilityChange: noop,

    getExcludedSelectors: noop,

    dispose: noop

});

export default EditDecorator;
