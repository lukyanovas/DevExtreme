"use strict";

import $ from '../../core/renderer';
import ready from './ready';
import changeCallbackFactory from '../../core/utils/callbacks';
const changeCallback = changeCallbackFactory();

var $originalViewPort = $();

var value = (function() {
    var $current;

    return function(element) {
        if(!arguments.length) {
            return $current;
        }

        var $element = $(element);
        $originalViewPort = $element;
        var isNewViewportFound = !!$element.length;
        var prevViewPort = value();
        $current = isNewViewportFound ? $element : $("body");
        changeCallback.fire(isNewViewportFound ? value() : $(), prevViewPort);
    };
})();

ready(function() {
    value(".dx-viewport");
});

export { value, changeCallback };

export var originalViewPort = function() {
    return $originalViewPort;
};
