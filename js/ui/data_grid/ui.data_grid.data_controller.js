"use strict";

import gridCore from './ui.data_grid.core';
import dataSourceAdapterProvider from './ui.data_grid.data_source_adapter';
import dataControllerModule from '../grid_core/ui.grid_core.data_controller';

export var DataController = dataControllerModule.controllers.data.inherit((function() {
    return {
        _getDataSourceAdapter: function() {
            return dataSourceAdapterProvider;
        }
    };
})());

gridCore.registerModule("data", {
    /**
    * @name dxDataGridOptions_keyExpr
    * @publicName keyExpr
    * @type string|Array<string>
    * @default undefined
    */
    defaultOptions: dataControllerModule.defaultOptions,
    controllers: {
        data: exports.DataController
    }
});
