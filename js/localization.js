'use strict';

/**
* @name localization
* @publicName localization
*/

/**
* @name localization_locale
* @publicName locale(
* @return string
* @static
* @module localization
* @export locale
*/

/**
* @name localization_locale
* @publicName locale(locale
* @param1 locale:string
* @static
* @module localization
* @export locale
*/
import { locale } from './localization/core';

/**
* @name localization_loadMessages
* @publicName loadMessages(
* @param1 messages:object
* @static
* @module localization
* @export loadMessages
*/
import { load as loadMessages } from './localization/message';
import * as message from './localization/message';
import * as number from './localization/number';
import * as date from './localization/date';
import * as currency from './localization/currency';

export { locale, loadMessages, message, number, date, currency };
