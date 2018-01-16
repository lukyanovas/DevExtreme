"use strict";
import domAdapter from '../dom_adapter';

var Element = domAdapter.getWindow().Element;

var matches = Element.prototype.matches ||
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(selector) {
        var items = (this.document || this.ownerDocument).querySelectorAll(selector);

        for(var i = 0; i < items.length; i++) {
            if(items[i] === this) {
                return true;
            }
        }
    };

export default function(element, selector) {
    return matches.call(element, selector);
}
