"use strict";

import { prototype as proto } from './tree_map.base';
import { Tracker } from '../components/tracker';
import { expand } from '../core/helpers';
import { parseScalar as _parseScalar } from '../core/utils';

var DATA_KEY_BASE = "__treemap_data_", dataKeyModifier = 0;

import './api';
import './hover';
import './tooltip';

proto._eventsMap.onClick = { name: "click" };
var dataKey;
expand(proto, "_initCore", function() {
    dataKey = DATA_KEY_BASE + dataKeyModifier++;

    var that = this,
        getProxy = function(index) {
            return that._nodes[index].proxy;
        };

    that._tracker = new Tracker({
        widget: that,
        root: that._renderer.root,
        getNode: function(id) {
            var proxy = getProxy(id),
                interactWithGroup = _parseScalar(that._getOption("interactWithGroup", true));

            return interactWithGroup && proxy.isLeaf() && proxy.getParent().isActive() ? proxy.getParent() : proxy;
        },
        getData: function(e) {
            var target = e.target;
            return (target.tagName === "tspan" ? target.parentNode : target)[dataKey];
        },
        getProxy: getProxy,
        click: function(e) {
            that._eventTrigger("click", e);
        }
    });
    that._handlers.setTrackerData = function(node, element) {
        element.data(dataKey, node._id);
    };
});

expand(proto, "_disposeCore", function() {
    this._tracker.dispose();
});
///#DEBUG
export var _TESTS_dataKey = dataKey;
///#ENDDEBUG
