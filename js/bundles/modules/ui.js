"use strict";

/* global DevExpress */

import './core';

export default DevExpress.ui = {};

/* Visual Studio Designer Callback (Find better place) */
DevExpress.ui.templateRendered = require("../../ui/widget/ui.template_base").renderedCallbacks;
