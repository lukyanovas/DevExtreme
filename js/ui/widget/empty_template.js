"use strict";

import $ from '../../core/renderer';
import TemplateBase from './ui.template_base';

var EmptyTemplate = TemplateBase.inherit({

    _renderCore: function() {
        return $();
    }

});


export default EmptyTemplate;
