"use strict";

import DataSourceAdapterModule from '../grid_core/ui.grid_core.data_source_adapter';
var DataSourceAdapter = DataSourceAdapterModule;
export default {
    extend: function(extender) {
        DataSourceAdapter = DataSourceAdapter.inherit(extender);
    },
    create: function(component) {
        return new DataSourceAdapter(component);
    }
};
