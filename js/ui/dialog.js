"use strict";

import $ from '../core/renderer';
import eventsEngine from '../events/core/events_engine';
import Component from '../core/component';
import { isFunction } from '../core/utils/type';
import Action from '../core/action';
import domUtils from '../core/utils/dom';
import { each } from '../core/utils/iterator';
import * as viewPortUtils from '../core/utils/view_port';
import { extend } from '../core/utils/extend';
import { isPlainObject } from '../core/utils/type';
import devices from '../core/devices';
import themes from './themes';
import errors from './widget/ui.errors';
import messageLocalization from '../localization/message';
import Popup from './popup';
import config from '../core/config';
import { Deferred } from '../core/utils/deferred';
import domAdapter from '../core/dom_adapter';

var window = domAdapter.getWindow();

var DEFAULT_BUTTON = {
    text: "OK",
    onClick: function() { return true; }
};

var DX_DIALOG_CLASSNAME = "dx-dialog",
    DX_DIALOG_WRAPPER_CLASSNAME = DX_DIALOG_CLASSNAME + "-wrapper",
    DX_DIALOG_ROOT_CLASSNAME = DX_DIALOG_CLASSNAME + "-root",
    DX_DIALOG_CONTENT_CLASSNAME = DX_DIALOG_CLASSNAME + "-content",
    DX_DIALOG_MESSAGE_CLASSNAME = DX_DIALOG_CLASSNAME + "-message",
    DX_DIALOG_BUTTONS_CLASSNAME = DX_DIALOG_CLASSNAME + "-buttons",
    DX_DIALOG_BUTTON_CLASSNAME = DX_DIALOG_CLASSNAME + "-button";

var FakeDialogComponent = Component.inherit({
    ctor: function(element, options) {
        this.callBase(options);
    },

    _defaultOptionsRules: function() {
        return this.callBase().concat([
            {
                device: { platform: "ios" },
                options: {
                    width: 276
                }
            },
            {
                device: { platform: "android" },
                options: {
                    lWidth: "60%",
                    pWidth: "80%"
                }
            },
            {
                device: function(device) {
                    var currentTheme = (themes.current() || "").split(".")[0];
                    return !device.phone && currentTheme === "win8";
                },
                options: {
                    width: function() {
                        return $(window).width();
                    }
                }
            },
            {
                device: function(device) {
                    var currentTheme = (themes.current() || "").split(".")[0];
                    return device.phone && currentTheme === "win8";
                },
                options: {
                    position: {
                        my: "top center",
                        at: "top center",
                        of: window,
                        offset: "0 0"
                    }
                }
            }
        ]);
    }
});
export { FakeDialogComponent };
export var title = "";

/**
 * @name ui_dialog
 * @publicName dialog
 * @namespace DevExpress.ui
 */

/**
 * @name ui_dialogmethods_custom
 * @publicName custom(options)
 * @return Object
 * @param1 options:object
 * @param1_field1 title:String
 * @param1_field2 message:String
 * @param1_field3 buttons:Array<Object>
 * @static
 * @module ui/dialog
 * @export custom
 */
export var custom = function(options) {
    var deferred = new Deferred();

    var defaultOptions = new FakeDialogComponent().option();

    options = extend(defaultOptions, options);

    var $element = $("<div>").addClass(DX_DIALOG_CLASSNAME)
        .appendTo(viewPortUtils.value());

    var $message = $("<div>").addClass(DX_DIALOG_MESSAGE_CLASSNAME)
        .html(String(options.message));

    var popupToolbarItems = [];

    var toolbarItemsOption = options.toolbarItems;

    if(toolbarItemsOption) {
        errors.log("W0001", "DevExpress.ui.dialog", "toolbarItems", "16.2", "Use the 'buttons' option instead");
    } else {
        toolbarItemsOption = options.buttons;
    }

    each(toolbarItemsOption || [DEFAULT_BUTTON], function() {
        var action = new Action(this.onClick, {
            context: popupInstance
        });

        popupToolbarItems.push({
            toolbar: 'bottom',
            location: devices.current().android ? 'after' : 'center',
            widget: 'dxButton',
            options: extend({}, this, {
                onClick: function() {
                    var result = action.execute(arguments);
                    hide(result);
                }
            })
        });
    });

    var popupInstance = new Popup($element, {
        title: options.title || exports.title,
        showTitle: function() {
            var isTitle = options.showTitle === undefined ? true : options.showTitle;
            return isTitle;
        }(),
        height: "auto",
        width: function() {
            var isPortrait = $(window).height() > $(window).width(),
                key = (isPortrait ? "p" : "l") + "Width",
                widthOption = options.hasOwnProperty(key) ? options[key] : options["width"];

            return isFunction(widthOption) ? widthOption() : widthOption;
        },
        showCloseButton: options.showCloseButton || false,
        focusStateEnabled: false,
        onContentReady: function(args) {
            args.component.$content()
                .addClass(DX_DIALOG_CONTENT_CLASSNAME)
                .append($message);
        },
        onShowing: function(e) {
            e.component
                .bottomToolbar()
                .addClass(DX_DIALOG_BUTTONS_CLASSNAME)
                .find(".dx-button")
                .addClass(DX_DIALOG_BUTTON_CLASSNAME);

            domUtils.resetActiveElement();
        },
        onShown: function(e) {
            var $firstButton = e.component
                .bottomToolbar()
                .find(".dx-button")
                .first();

            eventsEngine.trigger($firstButton, "focus");
        },
        onHiding: function() {
            deferred.reject();
        },
        toolbarItems: popupToolbarItems,
        animation: {
            show: {
                type: "pop",
                duration: 400
            },
            hide: {
                type: "pop",
                duration: 400,
                to: {
                    opacity: 0,
                    scale: 0
                },
                from: {
                    opacity: 1,
                    scale: 1
                }
            }
        },
        rtlEnabled: config().rtlEnabled,
        boundaryOffset: { h: 10, v: 0 }
    });

    popupInstance._wrapper().addClass(DX_DIALOG_WRAPPER_CLASSNAME);

    if(options.position) {
        popupInstance.option("position", options.position);
    }

    popupInstance._wrapper()
        .addClass(DX_DIALOG_ROOT_CLASSNAME);

    function show() {
        popupInstance.show();
        return deferred.promise();
    }

    function hide(value) {
        deferred.resolve(value);
        popupInstance.hide().done(function() {
            popupInstance.$element().remove();
        });
    }

    return {
        show: show,
        hide: hide
    };
};

/**
 * @name ui_dialogmethods_alert
 * @publicName alert(message,title)
 * @param1 message:string
 * @param2 title:string
 * @return Promise<void>
 * @static
 * @module ui/dialog
 * @export alert
 */
export var alert = function(message, title, showTitle) {
    var options = isPlainObject(message)
            ? message
            : {
                title: title,
                message: message,
                showTitle: showTitle
            };

    return custom(options).show();
};

/**
 * @name ui_dialogmethods_confirm
 * @publicName confirm(message,title)
 * @param1 message:string
 * @param2 title:string
 * @return Promise<boolean>
 * @static
 * @module ui/dialog
 * @export confirm
 */
export var confirm = function(message, title, showTitle) {
    var options = isPlainObject(message)
            ? message
            : {
                title: title,
                message: message,
                showTitle: showTitle,
                buttons: [
                    { text: messageLocalization.format("Yes"), onClick: function() { return true; } },
                    { text: messageLocalization.format("No"), onClick: function() { return false; } }
                ]
            };

    return custom(options).show();
};
