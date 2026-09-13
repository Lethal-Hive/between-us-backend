import * as dayjs from 'dayjs';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import * as localizedFormat from 'dayjs/plugin/localizedFormat';
import 'dayjs/locale/ar-sa';

export enum DateFormat {
  '0:00 PM' = 'LT',
  '0:00:00 PM' = 'LTS',
  '00/00/0000' = 'L',
  '0/00/0000' = 'l',
  'Aug 16, 2018' = 'll',
  'Aug 16, 2018 0:00 PM' = 'lll',
  'Thu, Aug 16, 2018 0:00 PM' = 'llll',
  '00/00/0000 0:00 PM' = 'L LT',
  '00/00/0000 0:00:00 PM' = 'L LTS',
  'August 16, 2018' = 'LL',
  'August 16, 2018 0:00 PM' = 'LLL',
  'Thursday, August 16, 2018 0:00 PM' = 'LLLL',
}

dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(localizedFormat);

export function getEgyptTimeZoneDate(optionalDate?: Date) {
  return dayjs(optionalDate).tz('Africa/Cairo');
}

export function getEgyptTimeZoneDateLocale(optionalDate?: Date) {
  return dayjs(optionalDate).tz('Africa/Cairo').locale('ar-sa');
}

export function getUTCDate(optionalDate?: Date) {
  return dayjs(optionalDate).utc();
}

export function UTCFromSeconds(seconds: number) {
  return dayjs.utc().add(seconds, 'second');
}
