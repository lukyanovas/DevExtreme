"use strict";

import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import ko from 'knockout';
import { isPlainObject } from '../../core/utils/type';
import eventRegistratorCallbacks from '../../events/core/event_registrator_callbacks';
import * as eventUtils from '../../events/utils';

eventRegistratorCallbacks.add(function(name) {
    var koBindingEventName = eventUtils.addNamespace(name, name + "Binding");

    ko.bindingHandlers[name] = {
        update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
            var $element = $(element),
                unwrappedValue = ko.utils.unwrapObservable(valueAccessor()),
                eventSource = unwrappedValue.execute ? unwrappedValue.execute : unwrappedValue;

            eventsEngine.off($element, koBindingEventName);
            eventsEngine.on($element, koBindingEventName, isPlainObject(unwrappedValue) ? unwrappedValue : {}, function(e) {
                eventSource.call(viewModel, viewModel, e);
            });
        }
    };
});
