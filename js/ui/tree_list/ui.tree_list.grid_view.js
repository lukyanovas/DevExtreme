"use strict";

import treeListCore from './ui.tree_list.core';
import gridViewModule from '../grid_core/ui.grid_core.grid_view';

var GridView = gridViewModule.views.gridView.inherit((function() {
    return {
        _getWidgetAriaLabel: function() {
            return "dxTreeList-ariaTreeList";
        }
    };
})());

treeListCore.registerModule("gridView", {
    defaultOptions: gridViewModule.defaultOptions,
    controllers: gridViewModule.controllers,
    views: {
        gridView: GridView
    }
});
