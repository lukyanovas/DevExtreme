"use strict";

import Class from '../core/class';
import EventsMixin from '../core/events_mixin';
import { each } from '../core/utils/iterator';
import errorsModule from './errors';
import dataUtils from './utils';
import { compileGetter } from '../core/utils/data';
import storeHelper from './store_helper';
import { Deferred } from '../core/utils/deferred';

var abstract = Class.abstract, queryByOptions = storeHelper.queryByOptions, storeImpl = {};

/**
* @name Store
* @publicName Store
* @type object
* @inherits EventsMixin
* @hidden
* @module data/abstract_store
* @export default
*/
var Store = Class.inherit({

    ctor: function(options) {
        var that = this;
        options = options || {};

        each(
            [
                /**
                 * @name StoreOptions_onLoaded
                 * @publicName onLoaded
                 * @type function
                 * @type_function_param1 result:Array<any>
                 * @action
                 */
                "onLoaded",

                /**
                 * @name StoreOptions_onLoading
                 * @publicName onLoading
                 * @type function
                 * @type_function_param1 loadOptions:LoadOptions
                 * @action
                 */
                "onLoading",

                /**
                 * @name StoreOptions_onInserted
                 * @publicName onInserted
                 * @type function
                 * @type_function_param1 values:object
                 * @type_function_param2 key:object|string|number
                 * @action
                 */
                "onInserted",

                /**
                 * @name StoreOptions_onInserting
                 * @publicName onInserting
                 * @type function
                 * @type_function_param1 values:object
                 * @action
                 */
                "onInserting",

                /**
                 * @name StoreOptions_onUpdated
                 * @publicName onUpdated
                 * @type function
                 * @type_function_param1 key:object|string|number
                 * @type_function_param2 values:object
                 * @action
                 */
                "onUpdated",

                /**
                 * @name StoreOptions_onUpdating
                 * @publicName onUpdating
                 * @type function
                 * @type_function_param1 key:object|string|number
                 * @type_function_param2 values:object
                 * @action
                 */
                "onUpdating",

                /**
                 * @name StoreOptions_onRemoved
                 * @publicName onRemoved
                 * @type function
                 * @type_function_param1 key:object|string|number
                 * @action
                 */
                "onRemoved",

                /**
                 * @name StoreOptions_onRemoving
                 * @publicName onRemoving
                 * @type function
                 * @type_function_param1 key:object|string|number
                 * @action
                 */
                "onRemoving",

                /**
                 * @name StoreOptions_onModified
                 * @publicName onModified
                 * @type function
                 * @action
                 */
                "onModified",

                /**
                 * @name StoreOptions_onModifying
                 * @publicName onModifying
                 * @type function
                 * @action
                 */
                "onModifying"
            ],
            function(_, optionName) {
                if(optionName in options) {
                    that.on(optionName.slice(2).toLowerCase(), options[optionName]);
                }
            });

        /**
         * @name StoreOptions_key
         * @publicName key
         * @type string|Array<string>
         */
        this._key = options.key;

        /**
         * @name StoreOptions_errorHandler
         * @publicName errorHandler
         * @type function
         */
        this._errorHandler = options.errorHandler;

        this._useDefaultSearch = true;
    },

    _customLoadOptions: function() {
        return null;
    },

    /**
    * @name StoreMethods_key
    * @publicName key()
    * @return any
    */
    key: function() {
        return this._key;
    },

    /**
    * @name StoreMethods_keyOf
    * @publicName keyOf(obj)
    * @param1 obj:object
    * @return any
    */
    keyOf: function(obj) {
        if(!this._keyGetter) {
            this._keyGetter = compileGetter(this.key());
        }

        return this._keyGetter(obj);
    },

    _requireKey: function() {
        if(!this.key()) {
            throw errorsModule.errors.Error("E4005");
        }
    },
    /**
    * @name StoreMethods_load
    * @publicName load()
    * @return Promise<any>
    */
    /**
    * @name StoreMethods_load
    * @publicName load(options)
    * @param1 options:LoadOptions
    * @return Promise<any>
    */
    load: function(options) {
        var that = this;

        options = options || {};

        this.fireEvent("loading", [options]);

        return this._withLock(this._loadImpl(options)).done(function(result) {
            that.fireEvent("loaded", [result, options]);
        });
    },

    _loadImpl: function(options) {
        return queryByOptions(this.createQuery(options), options).enumerate();
    },

    _withLock: function(task) {
        var result = new Deferred();

        task.done(function() {
            var that = this,
                args = arguments;

            dataUtils.processRequestResultLock
                .promise()
                .done(function() {
                    result.resolveWith(that, args);
                });

        }).fail(function() {
            result.rejectWith(this, arguments);
        });

        return result;
    },

    createQuery: abstract,

    /**
    * @name StoreMethods_totalCount
    * @publicName totalCount(options)
    * @param1 obj:object
    * @param1_field1 filter:object
    * @param1_field2 group:object
    * @return Promise<number>
    */
    totalCount: function(options) {
        return this._totalCountImpl(options);
    },

    _totalCountImpl: function(options) {
        return queryByOptions(this.createQuery(options), options, true).count();
    },

    /**
    * @name StoreMethods_byKey
    * @publicName byKey(key)
    * @param1 key:object|string|number
    * @return Promise<any>
    */
    byKey: function(key, extraOptions) {
        return this._addFailHandlers(this._withLock(this._byKeyImpl(key, extraOptions)));
    },

    _byKeyImpl: abstract,

    /**
    * @name StoreMethods_insert
    * @publicName insert(values)
    * @param1 values:object
    * @return Promise<any>
    */
    insert: function(values) {
        var that = this;

        that.fireEvent("modifying");
        that.fireEvent("inserting", [values]);

        return that._addFailHandlers(that._insertImpl(values).done(function(callbackValues, callbackKey) {
            that.fireEvent("inserted", [callbackValues, callbackKey]);
            that.fireEvent("modified");
        }));
    },

    _insertImpl: abstract,

    /**
    * @name StoreMethods_update
    * @publicName update(key, values)
    * @param1 key:object|string|number
    * @param2 values:object
    * @return Promise<any>
    */
    update: function(key, values) {
        var that = this;

        that.fireEvent("modifying");
        that.fireEvent("updating", [key, values]);

        return that._addFailHandlers(that._updateImpl(key, values).done(function(callbackKey, callbackValues) {
            that.fireEvent("updated", [callbackKey, callbackValues]);
            that.fireEvent("modified");
        }));
    },

    _updateImpl: abstract,

    /**
    * @name StoreMethods_remove
    * @publicName remove(key)
    * @param1 key:object|string|number
    * @return Promise<void>
    */
    remove: function(key) {
        var that = this;

        that.fireEvent("modifying");
        that.fireEvent("removing", [key]);

        return that._addFailHandlers(that._removeImpl(key).done(function(callbackKey) {
            that.fireEvent("removed", [callbackKey]);
            that.fireEvent("modified");
        }));
    },

    _removeImpl: abstract,

    _addFailHandlers: function(deferred) {
        return deferred.fail(this._errorHandler).fail(errorsModule._errorHandler);
    }
}).include(EventsMixin);

Store.create = function(alias, options) {
    if(!(alias in storeImpl)) {
        throw errorsModule.errors.Error("E4020", alias);
    }

    return new storeImpl[alias](options);
};

Store.inherit = function(inheritor) {
    return function(members, alias) {
        var type = inheritor.apply(this, [members]);
        if(alias) {
            storeImpl[alias] = type;
        }
        return type;
    };
}(Store.inherit);

export default Store;
