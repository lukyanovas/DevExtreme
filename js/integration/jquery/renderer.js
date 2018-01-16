"use strict";

import jQuery from 'jquery';
import rendererBase from '../../core/renderer_base';
import useJQueryFactory from './use_jquery';
const useJQuery = useJQueryFactory();

if(useJQuery) {
    rendererBase.set(jQuery);
}
