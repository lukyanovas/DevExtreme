"use strict";

import gridCore from './ui.data_grid.core';
import columnHeadersViewModule from '../grid_core/ui.grid_core.column_headers';

export var ColumnHeadersView = columnHeadersViewModule.views.columnHeadersView;

gridCore.registerModule("columnHeaders", columnHeadersViewModule);
