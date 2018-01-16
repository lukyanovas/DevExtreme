"use strict";

import gridCore from './ui.tree_list.core';
import dataSourceAdapter from './ui.tree_list.data_source_adapter';
import virtualScrollingModule from '../grid_core/ui.grid_core.virtual_scrolling';
import { extend } from '../../core/utils/extend';

var oldDefaultOptions = virtualScrollingModule.defaultOptions,
    originalDataControllerExtender = virtualScrollingModule.extenders.controllers.data;

virtualScrollingModule.extenders.controllers.data = extend({}, originalDataControllerExtender, {
    _loadOnOptionChange: function() {
        var virtualScrollController = this._dataSource && this._dataSource._virtualScrollController;

        virtualScrollController && virtualScrollController.reset();
        this.callBase();
    }
});

gridCore.registerModule("virtualScrolling", extend({}, virtualScrollingModule, {
    defaultOptions: function() {
        return extend(true, oldDefaultOptions(), {
            scrolling: {
                /**
                 * @name dxTreeListOptions_scrolling_mode
                 * @publicName mode
                 * @type string
                 * @acceptValues "standard" | "virtual"
                 * @default "virtual"
                 */
                mode: "virtual"
            }
        });
    }
}));

dataSourceAdapter.extend(virtualScrollingModule.extenders.dataSourceAdapter);
