"use strict";
import domAdapter from '../dom_adapter';

var window = domAdapter.getWindow();

var getSessionStorage = function() {
    var sessionStorage;

    try {
        sessionStorage = window.sessionStorage;
    } catch(e) { }

    return sessionStorage;
};

export var sessionStorage = getSessionStorage;
