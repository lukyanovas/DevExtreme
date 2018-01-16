"use strict";

import { extend } from '../../core/utils/extend';
import { BaseThemeManager } from '../core/base_theme_manager';

var _extend = extend;

var ThemeManager = BaseThemeManager.inherit({
    _themeSection: 'gauge',
    _fontFields: [
        'scale.label.font', 'valueIndicators.rangebar.text.font', 'valueIndicators.textcloud.text.font',
        'title.font', 'title.subtitle.font', 'tooltip.font', 'indicator.text.font', 'loadingIndicator.font', "export.font"
    ],
    _initializeTheme: function() {
        var that = this,
            subTheme;
        if(that._subTheme) {
            subTheme = _extend(true, {}, that._theme[that._subTheme], that._theme);
            _extend(true, that._theme, subTheme);
        }
        that.callBase.apply(that, arguments);
    }
});

export default ThemeManager;
