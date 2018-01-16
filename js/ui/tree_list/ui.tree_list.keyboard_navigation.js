"use strict";

import core from './ui.tree_list.core';
import keyboardNavigationModule from '../grid_core/ui.grid_core.keyboard_navigation';
import { extend } from '../../core/utils/extend';

core.registerModule("keyboardNavigation", extend(true, {}, keyboardNavigationModule, {
    extenders: {
        controllers: {
            keyboardNavigation: {
                _leftRightKeysHandler: function(eventArgs, isEditing) {
                    var rowIndex = this._getFocusedRowIndex(),
                        dataController = this._dataController,
                        key,
                        directionCode;

                    if(eventArgs.ctrl) {
                        directionCode = this._getDirectionCodeByKey(eventArgs.key);
                        key = dataController.getKeyByRowIndex(rowIndex);
                        if(directionCode === "nextInRow") {
                            dataController.expandRow(key);
                        } else {
                            dataController.collapseRow(key);
                        }
                    } else {
                        return this.callBase.apply(this, arguments);
                    }
                }
            }
        }
    }
}));
