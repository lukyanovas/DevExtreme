"use strict";

import { prototype as proto } from './funnel';
import { Tracker } from '../components/tracker';
import { isDefined } from '../../core/utils/type';

var DATA_KEY_BASE = "__funnel_data_", dataKeyModifier = 0;

proto._eventsMap.onItemClick = { name: "itemClick" };
proto._eventsMap.onLegendClick = { name: "legendClick" };

var dataKey;
export var plugin = {
    name: "tracker",
    init: function() {
        dataKey = DATA_KEY_BASE + dataKeyModifier++;
        var that = this,
            getProxyData = function(e) {
                var rootOffset = that._renderer.getRootOffset(),
                    x = Math.floor(e.pageX - rootOffset.left),
                    y = Math.floor(e.pageY - rootOffset.top);

                return that._hitTestTargets(x, y);
            };

        that._tracker = new Tracker({
            widget: that,
            root: that._renderer.root,
            getData: function(e, tooltipData) {
                var target = e.target,
                    data = target[dataKey],
                    proxyData;
                if(isDefined(data)) {
                    return data;
                }
                proxyData = getProxyData(e);

                if(tooltipData && proxyData && proxyData.type !== "inside-label") {
                    return;
                }

                return proxyData && proxyData.id;
            },
            getNode: function(index) {
                return that._items[index];
            },
            click: function(e) {
                var proxyData = getProxyData(e.event),
                    dataType = proxyData && proxyData.type,
                    event = dataType === "legend" ? "legendClick" : "itemClick";

                that._eventTrigger(event, {
                    item: e.node,
                    event: e.event
                });
            }
        });
        this._dataKey = dataKey;
    },
    dispose: function() {
        this._tracker.dispose();
    },
    extenders: {
        _change_TILING: function() {
            var dataKey = this._dataKey;
            this._items.forEach(function(item, index) {
                item.element.data(dataKey, index);
            });
        }
    }
};
///#DEBUG
export var _TESTS_dataKey = dataKey;
///#ENDDEBUG
