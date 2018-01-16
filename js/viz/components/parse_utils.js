"use strict";

import { noop } from '../../core/utils/common';
import dateSerialization from '../../core/utils/date_serialization';
import { isDefined } from '../../core/utils/type';

var parsers = {
    string: function(val) {
        return isDefined(val) ? ('' + val) : val;
    },

    numeric: function(val) {
        if(!isDefined(val)) {
            return val;
        }

        var parsedVal = Number(val);
        if(isNaN(parsedVal)) {
            parsedVal = undefined;
        }
        return parsedVal;
    },

    datetime: function(val) {
        if(!isDefined(val)) {
            return val;
        }

        var parsedVal,
            numVal = Number(val);
        if(!isNaN(numVal)) {
            parsedVal = new Date(numVal);
        } else {
            parsedVal = dateSerialization.deserializeDate(val);
        }
        if(isNaN(Number(parsedVal))) {
            parsedVal = undefined;
        }
        return parsedVal;
    }
};

function correctValueType(type) {
    return (type === 'numeric' || type === 'datetime' || type === 'string') ? type : '';
}

export default {
    correctValueType: correctValueType,

    getParser: function(valueType) {
        return parsers[correctValueType(valueType)] || noop;
    }
};

export { parsers };
