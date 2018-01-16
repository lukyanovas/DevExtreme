"use strict";

import { BaseThemeManager } from '../core/base_theme_manager';

export var ThemeManager = BaseThemeManager.inherit({
    _themeSection: "rangeSelector",
    _fontFields: ["scale.label.font", "sliderMarker.font", "loadingIndicator.font", "export.font", "title.font", "title.subtitle.font"]
});
