"use strict";

import dxTreeMap from './tree_map.base';

export default dxTreeMap;

import './tiling.squarified';
import './tiling.strip';
import './tiling.slice_and_dice';
import './tiling.rotated_slice_and_dice';
import './colorizing.discrete';
import './colorizing.gradient';
import './colorizing.range';
import './api';
import './hover';
import './selection';
import './tooltip';
import './tracker';
import './drilldown';
import './plain_data_source';

// PLUGINS_SECTION
dxTreeMap.addPlugin(require("../core/export").plugin);
dxTreeMap.addPlugin(require("../core/title").plugin);
dxTreeMap.addPlugin(require("../core/loading_indicator").plugin);
