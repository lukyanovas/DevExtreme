"use strict";

import { setPublicElementWrapper } from '../../core/utils/dom';
import useJQueryFactory from './use_jquery';
const useJQuery = useJQueryFactory();

var getPublicElement = function($element) {
    return $element;
};

if(useJQuery) {
    setPublicElementWrapper(getPublicElement);
}
