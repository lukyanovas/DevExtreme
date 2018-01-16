"use strict";

import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import clickEvent from '../../events/click';
import { isDefined } from '../../core/utils/type';
import { map } from '../../core/utils/iterator';
import { extend } from '../../core/utils/extend';
import sortingMixin from '../grid_core/ui.grid_core.sorting_mixin';
import messageLocalization from '../../localization/message';
import * as eventUtils from '../../events/utils';

var COLUMN_HEADERS_VIEW_NAMESPACE = "dxDataGridColumnHeadersView";

var ColumnHeadersViewSortingExtender = extend({}, sortingMixin, {
    _createRow: function(row) {
        var that = this,
            $row = that.callBase(row);

        if(row.rowType === "header") {
            eventsEngine.on($row, eventUtils.addNamespace(clickEvent.name, COLUMN_HEADERS_VIEW_NAMESPACE), "td", that.createAction(function(e) {
                if($(e.event.currentTarget).parent().get(0) !== $row.get(0)) {
                    return;
                }
                var keyName = null,
                    event = e.event,
                    $cellElementFromEvent = $(event.currentTarget),
                    rowIndex = $cellElementFromEvent.parent().index(),
                    columnIndex = map(that.getCellElements(rowIndex), function($cellElement, index) {
                        if($cellElement === $cellElementFromEvent.get(0)) return index;
                    })[0],
                    visibleColumns = that._columnsController.getVisibleColumns(rowIndex),
                    column = visibleColumns[columnIndex],
                    editingController = that.getController("editing"),
                    editingMode = that.option("editing.mode"),
                    isCellEditing = editingController && editingController.isEditing() && (editingMode === "batch" || editingMode === "cell");

                if(isCellEditing || !that._isSortableElement($(event.target))) {
                    return;
                }

                if(column && !isDefined(column.groupIndex) && !column.command) {
                    if(event.shiftKey) {
                        keyName = "shift";
                    } else if(event.ctrlKey) {
                        keyName = "ctrl";
                    }
                    setTimeout(function() {
                        that._columnsController.changeSortOrder(column.index, keyName);
                    });
                }
            }));
        }

        return $row;
    },

    _renderCellContent: function($cell, options) {
        var that = this,
            column = options.column;

        if(!column.command && options.rowType === "header") {
            that._applyColumnState({
                name: "sort",
                rootElement: $cell,
                column: column,
                showColumnLines: that.option("showColumnLines")
            });
        }

        that.callBase($cell, options);
    },

    _columnOptionChanged: function(e) {
        var changeTypes = e.changeTypes;

        if(changeTypes.length === 1 && changeTypes.sorting) {
            this._updateIndicators("sort");
            return;
        }

        this.callBase(e);
    },

    optionChanged: function(args) {
        var that = this;

        switch(args.name) {
            case "sorting":
                that._invalidate();
                args.handled = true;
                break;
            default:
                that.callBase(args);
        }
    }
});

var HeaderPanelSortingExtender = extend({}, sortingMixin, {
    _createGroupPanelItem: function($rootElement, groupColumn) {
        var that = this,
            $item = that.callBase.apply(that, arguments);

        eventsEngine.on($item, eventUtils.addNamespace(clickEvent.name, "dxDataGridHeaderPanel"), that.createAction(function() {
            setTimeout(function() {
                that.getController("columns").changeSortOrder(groupColumn.index);
            });
        }));

        that._applyColumnState({
            name: "sort",
            rootElement: $item,
            column: {
                alignment: that.option("rtlEnabled") ? "right" : "left",
                allowSorting: groupColumn.allowSorting,
                sortOrder: groupColumn.sortOrder === "desc" ? "desc" : "asc"
            },
            showColumnLines: true
        });

        return $item;
    },

    optionChanged: function(args) {
        var that = this;

        switch(args.name) {
            case "sorting":
                that._invalidate();
                args.handled = true;
                break;
            default:
                that.callBase(args);
        }
    }
});

export default {
    defaultOptions: function() {
        return {
            /**
             * @name GridBaseOptions_sorting
             * @publicName sorting
             * @type object
             */
            sorting: {
                /**
                 * @name GridBaseOptions_sorting_mode
                 * @publicName mode
                 * @type string
                 * @acceptValues "none" | "single" | "multiple"
                 * @default "single"
                 */
                mode: "single",
                /**
                 * @name GridBaseOptions_sorting_ascendingText
                 * @publicName ascendingText
                 * @type string
                 * @default "Sort Ascending"
                 */
                ascendingText: messageLocalization.format("dxDataGrid-sortingAscendingText"),
                /**
                 * @name GridBaseOptions_sorting_descendingText
                 * @publicName descendingText
                 * @type string
                 * @default "Sort Descending"
                 */
                descendingText: messageLocalization.format("dxDataGrid-sortingDescendingText"),
                /**
                 * @name GridBaseOptions_sorting_clearText
                 * @publicName clearText
                 * @type string
                 * @default "Clear Sorting"
                 */
                clearText: messageLocalization.format("dxDataGrid-sortingClearText")
            }
        };
    },
    extenders: {
        views: {
            columnHeadersView: ColumnHeadersViewSortingExtender,
            headerPanel: HeaderPanelSortingExtender
        }
    }
};
