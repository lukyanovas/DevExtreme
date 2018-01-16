"use strict";

import '../../integration/jquery';
import $ from 'jquery';
import Class from '../../core/class';
import { extend } from '../../core/utils/extend';
import { noop } from '../../core/utils/common';
import publicComponentUtils from '../../core/utils/public_component';

var MarkupComponent = Class.inherit({

    ctor: function(element, options) {
        this.NAME = publicComponentUtils.name(this.constructor);

        options = options || {};
        this._$element = $(element);
        publicComponentUtils.attachInstanceToElement(this._$element, this, this._dispose);
        if(options.fromCache) {
            this._options = options;
        } else {
            this._options = {};
            this._setDefaultOptions();
            if(options) {
                this.option(options);
            }
            this._render();
        }
    },

    _setDefaultOptions: noop,

    _render: noop,

    _dispose: noop,

    element: function() {
        return this._$element;
    },

    option: function(name, value) {
        if(arguments.length === 0) {
            return this._options;
        } else if(arguments.length === 1) {
            if(typeof name === "string") {
                return this._options[name];
            } else {
                value = name;
                extend(this._options, value);
            }
        } else {
            this._options[name] = value;
        }
    },

    instance: function() {
        return this;
    }

});
MarkupComponent.getInstance = function($element) {
    return publicComponentUtils.getInstanceByElement($($element), this);
};

export { MarkupComponent };
