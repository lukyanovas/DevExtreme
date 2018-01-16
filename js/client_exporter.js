"use strict";

import { fileSaver } from './client_exporter/file_saver';
import { isFunction as _isFunction } from './core/utils/type';
import * as ExcelCreator from './client_exporter/excel_creator';
import * as ImageCreator from './client_exporter/image_creator';
import * as SvgCreator from './client_exporter/svg_creator';
import * as PdfCreator from './client_exporter/pdf_creator';
import * as ExcelFormatConverter from './client_exporter/excel_format_converter';

var exportData = function(data, options, getData) {
    if(!data) {
        return;
    }

    // TODO: Can the following actions be not defined? (since they are provided by a widget not by a user)
    var exportingAction = options.exportingAction,
        exportedAction = options.exportedAction,
        fileSavingAction = options.fileSavingAction,
        eventArgs = {
            fileName: options.fileName,
            format: options.format,
            cancel: false
        };

    _isFunction(exportingAction) && exportingAction(eventArgs);

    if(!eventArgs.cancel) {
        getData(data, options, function(blob) {
            _isFunction(exportedAction) && exportedAction();

            if(_isFunction(fileSavingAction)) {
                eventArgs.data = blob;
                fileSavingAction(eventArgs);
            }

            if(!eventArgs.cancel) {
                fileSaver.saveAs(eventArgs.fileName, options.format, blob, options.proxyUrl);
            }
        });
    }
};

var excel = {
    creator: ExcelCreator.ExcelCreator,
    getData: ExcelCreator.getData,
    formatConverter: ExcelFormatConverter
};

///#DEBUG
excel.__internals = ExcelCreator.__internals;

///#ENDDEBUG
var image = {
    creator: ImageCreator.imageCreator,
    getData: ImageCreator.getData
};

var pdf = {
    getData: PdfCreator.getData
};

var svg = {
    creator: SvgCreator.svgCreator,
    getData: SvgCreator.getData
};

export {
    exportData as export,
    excel, fileSaver, image, pdf, svg
};
