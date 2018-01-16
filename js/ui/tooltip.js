"use strict";

/**
 * @name dxTooltip
 * @publicName dxTooltip
 * @inherits dxPopover
 * @groupName Overlays
 * @module ui/tooltip
 * @export default
 */
export default require("./tooltip/tooltip");

// NOTE: internal api: dashboards
export var show = require("./tooltip/ui.tooltip").show;

export var hide = require("./tooltip/ui.tooltip").hide;
