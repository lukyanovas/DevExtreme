"use strict";

import gridCore from './ui.data_grid.core';
import rowsViewModule from '../grid_core/ui.grid_core.rows';

export var RowsView = rowsViewModule.views.rowsView;

gridCore.registerModule("rows", rowsViewModule);
