<script lang="ts">
    import { currentTime } from "$lib/stores/currentTime";
    import type { Arrival } from "src/interfaces/Arrival";
    import type { DateDifference } from "src/interfaces/DateDifference";
    import { _ } from "svelte-i18n";

    export let arrival: Arrival;

    const getDateDiff = (startDate: Date, endDate: Date): DateDifference => {
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

    const getDisplayDiff = (startDate: Date, endDate: Date): string => {
        const valCount = (count: number) => ({ values: { count } });

        const diff = getDateDiff(startDate, endDate);

        if (diff.days >= 1) {
            return $_("day", valCount(diff.days)) + " " + $_("hour", valCount(diff.hours));
        } else if (diff.hours >= 1) {
            return $_("hour", valCount(diff.hours)) + " " + $_("minute", valCount(diff.minutes));
        } else if (diff.minutes >= 1) {
            return (
                $_("minute", valCount(diff.minutes)) + " " + $_("second", valCount(diff.seconds))
            );
        }
        return $_("second", valCount(diff.seconds));
    };
</script>

<div class="py-2">
    <h2>
        <span class="text-2xl text-cyan-500">{arrival.name}</span>
        {#if arrival.node}
            <a href="/board/{arrival.node}" class="ml-2 text-xl text-emerald-400 hover:underline"
                >{arrival.destination}</a
            >
        {:else}
            <span class="ml-2 text-xl text-emerald-400">{arrival.destination}</span>
        {/if}
    </h2>
    {#if arrival.isAtStop}
        <h3 class="text-lg text-gray-400">{$_("atStop")}</h3>
    {:else}
        <h3 class="text-lg">
            {getDisplayDiff($currentTime, arrival.time)}
        </h3>
    {/if}
</div>
