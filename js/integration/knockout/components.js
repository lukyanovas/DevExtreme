"use strict";

import $ from '../../core/renderer';
import eventsEngine from '../../events/core/events_engine';
import Action from '../../core/action';
import { compileGetter } from '../../core/utils/data';
import { extend } from '../../core/utils/extend';
import ko from 'knockout';
import iconUtils from '../../core/utils/icon';
import clickEvent from '../../events/click';

// TODO: dxAction as dxComponent?
// TODO: A comment for documentation is temporarily located in the framework.command.js file. Waiting for changes in DocGen...
ko.bindingHandlers.dxAction = {
    update: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var $element = $(element);

        var unwrappedValue = ko.utils.unwrapObservable(valueAccessor()),
            actionSource = unwrappedValue,
            actionOptions = { context: element };

        if(unwrappedValue.execute) {
            actionSource = unwrappedValue.execute;
            extend(actionOptions, unwrappedValue);
        }

        var action = new Action(actionSource, actionOptions);

        eventsEngine.off($element, ".dxActionBinding");
        eventsEngine.on($element, clickEvent.name + ".dxActionBinding", function(e) {
            action.execute({
                element: $element,
                model: viewModel,
                evaluate: function(expression) {
                    var context = viewModel;
                    if(expression.length > 0 && expression[0] === "$") {
                        context = ko.contextFor(element);
                    }
                    var getter = compileGetter(expression);
                    return getter(context);
                },
                event: e
            });

            if(!actionOptions.bubbling) {
                e.stopPropagation();
            }
        });
    }
};

ko.bindingHandlers.dxControlsDescendantBindings = {
    init: function(_, valueAccessor) {
        return {
            controlsDescendantBindings: ko.unwrap(valueAccessor())
        };
    }
};

ko.bindingHandlers.dxIcon = {
    init: function(element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {},
            iconElement = iconUtils.getImageContainer(options);

        ko.virtualElements.emptyNode(element);
        if(iconElement) {
            ko.virtualElements.prepend(element, iconElement.get(0));
        }
    },
    update: function(element, valueAccessor) {
        var options = ko.utils.unwrapObservable(valueAccessor()) || {},
            iconElement = iconUtils.getImageContainer(options);

        ko.virtualElements.emptyNode(element);
        if(iconElement) {
            ko.virtualElements.prepend(element, iconElement.get(0));
        }
    }
};
ko.virtualElements.allowedBindings.dxIcon = true;
