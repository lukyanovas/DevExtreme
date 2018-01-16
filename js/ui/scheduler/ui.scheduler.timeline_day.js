"use strict";

import registerComponent from '../../core/component_registrator';
import SchedulerTimeline from './ui.scheduler.timeline';

var TIMELINE_CLASS = "dx-scheduler-timeline-day";

var SchedulerTimelineDay = SchedulerTimeline.inherit({
    _getElementClass: function() {
        return TIMELINE_CLASS;
    },

    _setFirstViewDate: function() {
        this._firstViewDate = this.option("currentDate");
        this._setStartDayHour(this._firstViewDate);
    }
});

registerComponent("dxSchedulerTimelineDay", SchedulerTimelineDay);

export default SchedulerTimelineDay;
