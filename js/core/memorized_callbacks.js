"use strict";

import { each } from '../core/utils/iterator';
import Callbacks from './utils/callbacks';

var MemorizedCallbacks = function() {

    var memory = [];
    var callbacks = Callbacks();

    this.add = function(fn) {
        each(memory, function(_, item) {
            fn.apply(fn, item);
        });
        callbacks.add(fn);
    };

    this.remove = function(fn) {
        callbacks.remove(fn);
    };

    this.fire = function() {
        memory.push(arguments);
        callbacks.fire.apply(callbacks, arguments);
    };

};

export default MemorizedCallbacks;
