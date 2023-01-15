<script lang="ts">
    import { invalidate } from "$app/navigation";
    import type { DateDifference } from "src/interfaces/DateDifference";
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";
    import { _ } from "svelte-i18n";

    export let data: PageServerData;

    let currentTime: Date = new Date();

    $: filteredArrivals = data.arrivals
        .filter((a) => a.time > currentTime || a.isAtStop)
        .slice(0, 6);

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

    onMount(async () => {
        const invalidateInterval = setInterval(() => invalidate("departures"), 5000);
        const timeInterval = setInterval(() => (currentTime = new Date()), 1000);

        return () => {
            clearInterval(invalidateInterval);
            clearInterval(timeInterval);
        };
    });
</script>

<div class="text-teal-400 w-full flex-col flex items-center px-4">
    <div class="px-4 pb-4 md:w-4/5 w-full rounded-lg">
        {#if data.stopName}
            <div class="border-b-2 border-gray-500 mb-4 py-4">
                <h1 class="text-3xl">{data.stopName}</h1>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each filteredArrivals as arrival}
                    <div class="py-2">
                        <h2>
                            <span class="text-2xl text-cyan-500">{arrival.name}</span>
                            {#if arrival.node}
                                <a
                                    href="/board/{arrival.node}"
                                    class="text-xl ml-2 text-emerald-400 hover:underline"
                                    >{arrival.destination}</a
                                >
                            {:else}
                                <span class="text-xl ml-2 text-emerald-400"
                                    >{arrival.destination}</span
                                >
                            {/if}
                        </h2>
                        {#if arrival.isAtStop}
                            <h3 class="text-lg text-gray-400">{$_("atStop")}</h3>
                        {:else}
                            <h3 class="text-lg">
                                {getDisplayDiff(currentTime, arrival.time)}
                            </h3>
                        {/if}
                    </div>
                {/each}
            </div>
        {:else}
            <h1 class="text-3xl">{$_("loading")}</h1>
        {/if}
    </div>
</div>
