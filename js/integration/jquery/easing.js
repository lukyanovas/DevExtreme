"use strict";

import jQuery from 'jquery';
import { setEasing } from '../../animation/easing';

if(jQuery) {
    setEasing(jQuery.easing);
}
