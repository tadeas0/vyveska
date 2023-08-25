import type { DateDifference } from "$lib/interfaces/DateDifference";
import { _ } from "svelte-i18n";
import { get } from "svelte/store";

export const getDateDiff = (startDate: Date, endDate: Date): DateDifference => {
    const msInSec = 1000;
    const msInMin = 60 * msInSec;
    const msInHour = 60 * msInMin;
    const msInDay = 24 * msInHour;

    const diff = (startDate: Date, endDate: Date, mod: number, granularity: number): number => {
        return Math.floor(((endDate.getTime() - startDate.getTime()) % mod) / granularity);
    };

    return {
        days: diff(startDate, endDate, 1, msInDay),
        hours: diff(startDate, endDate, msInDay, msInHour),
        minutes: diff(startDate, endDate, msInHour, msInMin),
        seconds: diff(startDate, endDate, msInMin, msInSec)
    };
};

export const getDisplayDiff = (startDate: Date, endDate: Date): string => {
    const valCount = (count: number) => ({ values: { count } });
    const $_ = get(_);

    const diff = getDateDiff(startDate, endDate);

    if (diff.days >= 1) {
        return $_("day", valCount(diff.days)) + " " + $_("hour", valCount(diff.hours));
    } else if (diff.hours >= 1) {
        return $_("hour", valCount(diff.hours)) + " " + $_("minute", valCount(diff.minutes));
    } else if (diff.minutes >= 1) {
        return $_("minute", valCount(diff.minutes)) + " " + $_("second", valCount(diff.seconds));
    } else if (diff.seconds >= 1) {
        return $_("second", valCount(diff.seconds));
    } else {
        return $_("now");
    }
};

export const getFormattedTime = (date: Date) => {
    const m = ("0" + date.getMinutes()).slice(-2);
    const h = ("0" + date.getHours()).slice(-2);
    return `${h}:${m}`;
};
