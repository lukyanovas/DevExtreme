'use strict';

import jQuery from 'jquery';
import { setStrategy } from '../../core/utils/ajax';
import useJQueryFactory from './use_jquery';
const useJQuery = useJQueryFactory();

if(useJQuery) {
    setStrategy(jQuery.ajax);
}
