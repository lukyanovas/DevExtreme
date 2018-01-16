'use strict';

import jQuery from 'jquery';
import { setDataStrategy } from '../../core/element_data';
import useJQueryFactory from './use_jquery';

if(useJQueryFactory()) {
    setDataStrategy(jQuery);
}
