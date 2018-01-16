"use strict";

import eventsEngine from '../events/core/events_engine';
import Class from '../core/class';
import { errors } from './errors';
import ArrayStore from './array_store';
import domAdapter from '../core/dom_adapter';

var window = domAdapter.getWindow(), document = window.document, localStorage = window.localStorage, abstract = Class.abstract;

var LocalStoreBackend = Class.inherit({

    ctor: function(store, storeOptions) {
        this._store = store;
        this._dirty = !!storeOptions.data;
        this.save();

        var immediate = this._immediate = storeOptions.immediate;
        var flushInterval = Math.max(100, storeOptions.flushInterval || 10 * 1000);

        if(!immediate) {
            var saveProxy = this.save.bind(this);
            setInterval(saveProxy, flushInterval);
            eventsEngine.on(window, "beforeunload", saveProxy);
            if(window.cordova) {
                document.addEventListener("pause", saveProxy, false);
            }
        }
    },

    notifyChanged: function() {
        this._dirty = true;
        if(this._immediate) {
            this.save();
        }
    },

    load: function() {
        this._store._array = this._loadImpl();
        this._dirty = false;
    },

    save: function() {
        if(!this._dirty) {
            return;
        }

        this._saveImpl(this._store._array);
        this._dirty = false;
    },

    _loadImpl: abstract,
    _saveImpl: abstract
});

var DomLocalStoreBackend = LocalStoreBackend.inherit({

    ctor: function(store, storeOptions) {
        var name = storeOptions.name;
        if(!name) {
            throw errors.Error("E4013");
        }
        this._key = "dx-data-localStore-" + name;

        this.callBase(store, storeOptions);
    },

    _loadImpl: function() {
        var raw = localStorage.getItem(this._key);
        if(raw) {
            return JSON.parse(raw);
        }
        return [];
    },

    _saveImpl: function(array) {
        if(!array.length) {
            localStorage.removeItem(this._key);
        } else {
            localStorage.setItem(this._key, JSON.stringify(array));
        }
    }

});

var localStoreBackends = {
    "dom": DomLocalStoreBackend
};


/**
* @name LocalStore
* @publicName LocalStore
* @inherits ArrayStore
* @type object
* @module data/local_store
* @export default
*/
var LocalStore = ArrayStore.inherit({

    ctor: function(options) {
        /**
         * @name LocalStoreOptions_name
         * @publicName name
         * @type string
         */
        if(typeof options === "string") {
            options = { name: options };
        } else {
            options = options || {};
        }

        this.callBase(options);

        /**
         * @name LocalStoreOptions_immediate
         * @publicName immediate
         * @type boolean
         * @default false
         */
        /**
         * @name LocalStoreOptions_flushInterval
         * @publicName flushInterval
         * @type number
         * @default 10000
         */
        this._backend = new localStoreBackends[options.backend || "dom"](this, options);
        this._backend.load();
    },

    /**
    * @name LocalStoreMethods_clear
    * @publicName clear()
    */
    clear: function() {
        this.callBase();
        this._backend.notifyChanged();
    },

    _insertImpl: function(values) {
        var b = this._backend;
        return this.callBase(values).done(b.notifyChanged.bind(b));
    },

    _updateImpl: function(key, values) {
        var b = this._backend;
        return this.callBase(key, values).done(b.notifyChanged.bind(b));
    },

    _removeImpl: function(key) {
        var b = this._backend;
        return this.callBase(key).done(b.notifyChanged.bind(b));
    }
}, "local");

export default LocalStore;
