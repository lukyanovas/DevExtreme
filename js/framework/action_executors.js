"use strict";

import '../integration/jquery';
import $ from 'jquery';
import dataCoreUtils from '../core/utils/data';
import { extend } from '../core/utils/extend';
import { isPlainObject } from '../core/utils/type';
import { map } from '../core/utils/iterator';
import { Route } from './router';
import domAdapter from '../core/dom_adapter';

var document = domAdapter.getWindow().document;

function prepareNavigateOptions(options, actionArguments) {
    if(actionArguments.args) {
        var sourceEventArguments = actionArguments.args[0];
        options.event = sourceEventArguments.event;
    }
    if((actionArguments.component || {}).NAME === "dxCommand") {
        extend(options, actionArguments.component.option());
    }
}

function preventDefaultLinkBehavior(e) {
    if(!e) {
        return;
    }

    var $targetElement = $(e.target);

    if($targetElement.attr('href')) {
        e.preventDefault();
    }
}

var createActionExecutors = function(app) {
    return {
        "routing": {
            execute: function(e) {
                var action = e.action,
                    options = {},
                    routeValues,
                    uri;

                if(isPlainObject(action)) {
                    routeValues = action.routeValues;

                    if(routeValues && isPlainObject(routeValues)) {
                        options = action.options;
                    } else {
                        routeValues = action;
                    }

                    uri = app.router.format(routeValues);

                    prepareNavigateOptions(options, e);
                    preventDefaultLinkBehavior(options.event);
                    app.navigate(uri, options);
                    e.handled = true;
                }
            }
        },
        "hash": {
            execute: function(e) {
                if(typeof e.action !== "string" || e.action.charAt(0) !== "#") {
                    return;
                }

                var uriTemplate = e.action.substr(1),
                    args = e.args[0],
                    uri = uriTemplate;

                var defaultEvaluate = function(expr) {
                    var getter = dataCoreUtils.compileGetter(expr),
                        model = e.args[0].model;

                    return getter(model);
                };

                var evaluate = args.evaluate || defaultEvaluate;

                uri = uriTemplate.replace(/\{([^}]+)\}/g, function(entry, expr) {
                    expr = expr.trim();
                    if(expr.indexOf(",") > -1) {
                        expr = map(expr.split(","), function(item) {
                            return item.trim();
                        });
                    }
                    var value = evaluate(expr);
                    if(value === undefined) {
                        value = "";
                    }
                    value = Route.prototype.formatSegment(value);

                    return value;
                });

                var options = {};
                prepareNavigateOptions(options, e);
                preventDefaultLinkBehavior(options.event);
                app.navigate(uri, options);
                e.handled = true;
            }
        },
        "url": {
            execute: function(e) {
                if(typeof e.action === "string" && e.action.charAt(0) !== "#") {
                    document.location = e.action;
                }
            }
        }
    };
};

export { createActionExecutors };
