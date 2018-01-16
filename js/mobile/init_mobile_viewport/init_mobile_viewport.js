"use strict";

import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import { extend } from '../../core/utils/extend';
import { resizeCallbacks } from '../../core/utils/window';
import * as support from '../../core/utils/support';
import * as styleUtils from '../../core/utils/style';
import devices from '../../core/devices';
import domAdapter from '../../core/dom_adapter';

var window = domAdapter.getWindow(), document = window.document;

var initMobileViewport = function(options) {
    options = extend({}, options);
    var realDevice = devices.real();
    var allowZoom = options.allowZoom;
    var allowPan = options.allowPan;
    var allowSelection = ("allowSelection" in options) ? options.allowSelection : realDevice.platform === "generic";

    var metaSelector = "meta[name=viewport]";
    if(!$(metaSelector).length) {
        $("<meta>").attr("name", "viewport").appendTo("head");
    }

    var metaVerbs = ["width=device-width"],
        msTouchVerbs = [];

    if(allowZoom) {
        msTouchVerbs.push("pinch-zoom");
    } else {
        metaVerbs.push("initial-scale=1.0", "maximum-scale=1.0, user-scalable=no");
    }

    if(allowPan) {
        msTouchVerbs.push("pan-x", "pan-y");
    }

    if(!allowPan && !allowZoom) {
        $("html, body").css({
            "-ms-content-zooming": "none",
            "-ms-user-select": "none",
            "overflow": "hidden"
        });
    } else {
        $("html").css("-ms-overflow-style", "-ms-autohiding-scrollbar");
    }

    if(!allowSelection && support.supportProp("user-select")) {
        $(".dx-viewport").css(styleUtils.styleProp("user-select"), "none");
    }

    $(metaSelector).attr("content", metaVerbs.join());
    $("html").css("-ms-touch-action", msTouchVerbs.join(" ") || "none");

    realDevice = devices.real();

    if(support.touch && !(realDevice.platform === "win" && realDevice.version[0] === 10)) {
        eventsEngine.off(document, ".dxInitMobileViewport");
        eventsEngine.on(document, "dxpointermove.dxInitMobileViewport", function(e) {
            var count = e.pointers.length,
                isTouchEvent = e.pointerType === "touch",
                zoomDisabled = !allowZoom && count > 1,
                panDisabled = !allowPan && count === 1 && !e.isScrollingEvent;

            if(isTouchEvent && (zoomDisabled || panDisabled)) {
                e.preventDefault();
            }
        });
    }

    if(realDevice.ios) {
        var isPhoneGap = (document.location.protocol === "file:");

        if(!isPhoneGap) {
            // NOTE: fix app size after device rotation in Safari when keyboard was shown
            resizeCallbacks.add(function() {
                var windowWidth = $(window).width();
                $("body").width(windowWidth);
            });
        }
    }

    if(realDevice.android) {
        resizeCallbacks.add(function() {
            setTimeout(function() {
                var activeElement = document.activeElement;

                activeElement.scrollIntoViewIfNeeded ?
                    activeElement.scrollIntoViewIfNeeded() :
                    activeElement.scrollIntoView(false);
            });
        });
    }
};

export { initMobileViewport };
