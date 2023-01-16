<script lang="ts">
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";
    import { _ } from "svelte-i18n";
    import { ARRIVAL_NUM } from "$lib/constants";
    import { page } from "$app/stores";
    import { parseArrival } from "$lib/common/helpers";
    import ArrivalDisplay from "$lib/components/ArrivalDisplay.svelte";
    import type { Arrival } from "src/interfaces/Arrival";

    export let data: PageServerData;

    $: ({ arrivals, stopName } = data);
    let currentTime: Date = new Date();
    let pageNum = 1;
    let noMoreArrivals = false;
    let scrollY: number;

    $: filteredArrivals = arrivals
        .filter((a) => a.time > currentTime || a.isAtStop)
        .slice(0, pageNum * ARRIVAL_NUM);

    const fetchData = async () => {
        const res = await fetch(
            `/api/departure/${$page.params.aswId}?limit=${pageNum * (ARRIVAL_NUM + 5)}`
        );
        const data = await res.json();
        const parsedArrivals: Arrival[] = data.arrivals.map(parseArrival);
        const parsedJson = JSON.stringify(parsedArrivals[parsedArrivals.length - 1]);
        const arrivalJson = JSON.stringify(arrivals[arrivals.length - 1]);
        if (parsedJson === arrivalJson) {
            noMoreArrivals = true;
            return;
        }
        arrivals = parsedArrivals;
        stopName = data.stopName;
    };

    onMount(async () => {
        scrollY = 0;
        const fetchInterval = setInterval(fetchData, 5000);
        const timeInterval = setInterval(() => (currentTime = new Date()), 1000);

        return () => {
            clearInterval(timeInterval);
            clearInterval(fetchInterval);
        };
    });

    const handleScroll = async () => {
        if (noMoreArrivals) return;

        const offset = 50;

        if (window.innerHeight + scrollY > document.body.offsetHeight - offset) {
            pageNum += 1;
            await fetchData();
        }
    };
</script>

<svelte:window on:scroll={handleScroll} bind:scrollY />

<div class="flex w-full flex-col items-center px-4 text-teal-400">
    <div class="w-full rounded-lg px-4 pb-4 md:w-4/5">
        {#if stopName}
            <div class="mb-4 border-b-2 border-gray-500 py-4">
                <h1 class="text-3xl">{stopName}</h1>
            </div>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                {#each filteredArrivals as arrival}
                    <ArrivalDisplay {arrival} {currentTime} />
                {/each}
            </div>
        {:else}
            <h1 class="text-3xl">{$_("loading")}</h1>
        {/if}
    </div>
</div>
