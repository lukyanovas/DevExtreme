"use strict";

import { extend } from '../../core/utils/extend';
import ToolbarStrategy from './ui.toolbar.strategy';
import ToolbarMenu from './ui.toolbar.menu';
import DropDownMenu from '../drop_down_menu';

var MENU_INVISIBLE_CLASS = "dx-state-invisible";

var DropDownMenuStrategy = ToolbarStrategy.inherit({

    NAME: "dropDownMenu",

    render: function() {
        if(!this._hasVisibleMenuItems()) {
            return;
        }

        this._renderMenuButtonContainer();
        this._renderWidget();
    },

    renderMenuItems: function() {
        if(!this._menu) {
            this.render();
        }

        this.callBase();
        if(this._menu && !this._menu.option("items").length) {
            this._menu.close();
        }
    },

    _menuWidgetClass: function() {
        return DropDownMenu;
    },

    _widgetOptions: function() {
        return extend(this.callBase(), {
            deferRendering: true,
            menuWidget: ToolbarMenu,
            popupPosition: {
                at: "bottom right",
                my: "top right"
            }
        });
    },

    _getMenuItems: function() {
        var menuItems = this.callBase(),
            isMenuVisible = menuItems.length && this._hasVisibleMenuItems(menuItems);
        this._toggleMenuVisibility(isMenuVisible);
        return menuItems;
    },

    _toggleMenuVisibility: function(value) {
        if(!this._menuContainer()) {
            return;
        }

        this._menuContainer().toggleClass(MENU_INVISIBLE_CLASS, !value);
    },

    _menuContainer: function() {
        return this._$menuButtonContainer;
    }

});

export default DropDownMenuStrategy;
