"use strict";

import { BaseThemeManager } from '../core/base_theme_manager';

export var ThemeManager = BaseThemeManager.inherit({
    _themeSection: "map",

    _fontFields: [
        "layer:area.label.font",
        "layer:marker:dot.label.font", "layer:marker:bubble.label.font", "layer:marker:pie.label.font", "layer:marker:image.label.font",
        "tooltip.font", "legend.font", "title.font", "title.subtitle.font", "loadingIndicator.font", "export.font"
    ]
});
