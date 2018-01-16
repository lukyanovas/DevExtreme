"use strict";

import $ from '../../core/renderer';
import Guid from '../../core/guid';
import registerComponent from '../../core/component_registrator';
import { extend } from '../../core/utils/extend';
import Popover from '../popover';

var TOOLTIP_CLASS = "dx-tooltip", TOOLTIP_WRAPPER_CLASS = "dx-tooltip-wrapper";

var Tooltip = Popover.inherit({
    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            /**
            * @name dxTooltipOptions_toolbarItems
            * @publicName toolbarItems
            * @hidden
            * @extend_doc
            */
            toolbarItems: [],

            /**
            * @name dxTooltipOptions_showCloseButton
            * @publicName showCloseButton
            * @hidden
            * @extend_doc
            */
            showCloseButton: false,

            /**
            * @name dxTooltipOptions_showtitle
            * @publicName showTitle
            * @hidden
            * @extend_doc
            */
            showTitle: false,

            /**
            * @name dxTooltipOptions_title
            * @publicName title
            * @hidden
            * @extend_doc
            */
            title: null,

            /**
            * @name dxTooltipOptions_titleTemplate
            * @publicName titleTemplate
            * @hidden
            * @extend_doc
            */
            titleTemplate: null,

            /**
            * @name dxTooltipOptions_onTitleRendered
            * @publicName onTitleRendered
            * @hidden
            * @extend_doc
            */
            onTitleRendered: null,
            bottomTemplate: null,
            propagateOutsideClick: true
        });
    },

    _render: function() {
        this.$element().addClass(TOOLTIP_CLASS);
        this._wrapper().addClass(TOOLTIP_WRAPPER_CLASS);
        this.callBase();
    },

    _renderContent: function() {
        this.callBase();

        this._contentId = "dx-" + new Guid();

        this._$content.attr({
            "id": this._contentId,
            "role": "tooltip"
        });

        this._toggleAriaDescription(true);
    },

    _toggleAriaDescription: function(showing) {
        var $target = $(this.option("target")),
            label = showing ? this._contentId : undefined;

        this.setAria("describedby", label, $target);
    }
});

registerComponent("dxTooltip", Tooltip);

export default Tooltip;
