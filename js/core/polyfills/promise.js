"use strict";

import { Deferred, when } from '../../core/utils/deferred';
import domAdapter from '../../core/dom_adapter';

var window = domAdapter.getWindow(), Promise = window.Promise;

if(!Promise) {
    // NOTE: This is an incomplete Promise polyfill but it is enough for creation purposes

    Promise = function(resolver) {
        var d = new Deferred();
        resolver(d.resolve.bind(this), d.reject.bind(this));
        return d.promise();
    };

    Promise.resolve = function(val) {
        return new Deferred().resolve(val).promise();
    };

    Promise.reject = function(val) {
        return new Deferred().reject(val).promise();
    };

    Promise.all = function(promises) {
        return when.apply(this, promises).then(function() {
            return [].slice.call(arguments);
        });
    };
}

export default Promise;
