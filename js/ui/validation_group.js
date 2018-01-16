"use strict";

import $ from '../core/renderer';
import registerComponent from '../core/component_registrator';
import DOMComponent from '../core/dom_component';
import ValidationSummary from './validation_summary';
import ValidationEngine from './validation_engine';
import Validator from './validator';

var VALIDATION_ENGINE_CLASS = "dx-validationgroup";
/**
 * @name dxValidationGroup
 * @publicName dxValidationGroup
 * @inherits DOMComponent
 * @groupName Helpers
 * @module ui/validation_group
 * @export default
 */
var ValidationGroup = DOMComponent.inherit({
    _getDefaultOptions: function() {
        return this.callBase();

        /**
        * @name dxValidationGroupOptions_rtlEnabled
        * @publicName rtlEnabled
        * @hidden
        * @extend_doc
        */

        /**
        * @name dxValidationGroupMethods_beginUpdate
        * @publicName beginUpdate()
        * @hidden
        * @extend_doc
        */
        /**
        * @name dxValidationGroupMethods_defaultOptions
        * @publicName defaultOptions(rule)
        * @hidden
        * @extend_doc
        */
        /**
        * @name dxValidationGroupMethods_endUpdate
        * @publicName endUpdate()
        * @hidden
        * @extend_doc
        */
    },

    _init: function() {
        this.callBase();
    },

    _render: function() {
        var $element = this.$element();
        $element.addClass(VALIDATION_ENGINE_CLASS);

        $element.find(".dx-validator").each(function(_, validatorContainer) {
            Validator.getInstance($(validatorContainer))._initGroupRegistration();
        });


        $element.find(".dx-validationsummary").each(function(_, summaryContainer) {
            ValidationSummary.getInstance($(summaryContainer))._initGroupRegistration();
        });

        this.callBase();
    },

    /**
     * @name dxValidationGroupMethods_validate
     * @publicName validate()
     * @return Object
     */
    validate: function() {
        return ValidationEngine.validateGroup(this);
    },

    /**
     * @name dxValidationGroupMethods_reset
     * @publicName reset()
     */
    reset: function() {
        return ValidationEngine.resetGroup(this);
    },

    _optionChanged: function(args) {
        switch(args.name) {
            default:
                this.callBase(args);
        }
    },

    _dispose: function() {
        ValidationEngine.removeGroup(this);
        this.$element().removeClass(VALIDATION_ENGINE_CLASS);

        this.callBase();
    }
});

registerComponent("dxValidationGroup", ValidationGroup);

export default ValidationGroup;
