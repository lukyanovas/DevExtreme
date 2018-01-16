"use strict";

import dependencyInjector from '../core/utils/dependency_injector';

export default dependencyInjector({
    locale: (function() {
        var currentLocale = "en";

        return function(locale) {
            if(!locale) {
                return currentLocale;
            }

            currentLocale = locale;
        };
    })()
});
