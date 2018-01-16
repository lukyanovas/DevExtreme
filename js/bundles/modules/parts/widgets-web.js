"use strict";

import data from './data';
import ui from './widgets-base';

/// BUNDLER_PARTS
/* Web widgets (dx.module-widgets-web.js) */

ui.dxAccordion = require("../../../ui/accordion");
ui.dxContextMenu = require("../../../ui/context_menu");
ui.dxDataGrid = require("../../../ui/data_grid");
ui.dxTreeList = require("../../../ui/tree_list");
ui.dxMenu = require("../../../ui/menu");
ui.dxPivotGrid = require("../../../ui/pivot_grid");
ui.dxPivotGridFieldChooser = require("../../../ui/pivot_grid_field_chooser");
data.PivotGridDataSource = require("../../../ui/pivot_grid/data_source");
data.XmlaStore = require("../../../ui/pivot_grid/xmla_store");
ui.dxScheduler = require("../../../ui/scheduler");
ui.dxTreeView = require("../../../ui/tree_view");
ui.dxFilterBuilder = require("../../../ui/filter_builder");
/// BUNDLER_PARTS_END
