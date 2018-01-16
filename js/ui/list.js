"use strict";

import ListEdit from './list/ui.list.edit.search';
import registerComponent from '../core/component_registrator';
/**
* @name dxList
* @publicName dxList
* @inherits CollectionWidget, SearchBoxMixin
* @groupName Collection Widgets
* @module ui/list
* @export default
*/
registerComponent("dxList", ListEdit);

export default ListEdit;
