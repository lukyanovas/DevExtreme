"use strict";

import { inArray } from '../../core/utils/array';
import domAdapter from '../../core/dom_adapter';

var window = domAdapter.getWindow(), WeakMap = window.WeakMap;

if(!WeakMap) {
    // NOTE: This is an incomplete WeakMap polyfill but it is enough for creation purposes

    WeakMap = function() {
        var keys = [],
            values = [];

        this.set = function(key, value) {
            var index = inArray(key, keys);
            if(index === -1) {
                keys.push(key);
                values.push(value);
            } else {
                values[index] = value;
            }
        };

        this.get = function(key) {
            var index = inArray(key, keys);
            if(index === -1) {
                return undefined;
            }
            return values[index];
        };

        this.has = function(key) {
            var index = inArray(key, keys);
            if(index === -1) {
                return false;
            }
            return true;
        };

        this.delete = function(key) {
            var index = inArray(key, keys);
            if(index === -1) {
                return;
            }
            keys.splice(index, 1);
            values.splice(index, 1);
        };
    };
}

export default WeakMap;
