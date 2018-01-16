"use strict";

import $ from '../../core/renderer';
import TemplateBase from '../../ui/widget/ui.template_base';
import { isFunction } from '../../core/utils/type';
import domUtils from '../../core/utils/dom';

var NgTemplate = TemplateBase.inherit({

    ctor: function(element, templateCompiler) {
        this._element = element;

        this._compiledTemplate = templateCompiler(domUtils.normalizeTemplateElement(this._element));
    },

    _renderCore: function(options) {
        var compiledTemplate = this._compiledTemplate,
            result = isFunction(compiledTemplate) ? compiledTemplate(options) : compiledTemplate;

        return result;
    },

    source: function() {
        return $(this._element).clone();
    }

});

export default NgTemplate;
