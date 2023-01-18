<script lang="ts">
    import { onMount } from "svelte";
    import type { PageServerData } from "./$types";
    import { _ } from "svelte-i18n";
    import { ARRIVAL_NUM } from "$lib/constants";
    import { page } from "$app/stores";
    import { parseArrival } from "$lib/common/helpers";
    import ArrivalDisplay from "$lib/components/ArrivalDisplay.svelte";
    import type { Arrival } from "$lib/interfaces/Arrival";
    import { currentTime } from "$lib/stores/currentTime";
    import Board from "$lib/components/Board.svelte";

    export let data: PageServerData;

    $: ({ arrivals, stopName } = data);
    $: filteredArrivals = arrivals
        .filter((a) => a.time > $currentTime || a.isAtStop)
        .slice(0, pageNum * ARRIVAL_NUM);

    let pageNum = 1;
    let noMoreArrivals = false;
    let scrollY: number;

    const fetchData = async () => {
        const res = await fetch(
            `/api/station/${$page.params.aswId}?limit=${pageNum * (ARRIVAL_NUM + 5)}`
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

        return () => {
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

<svelte:head>
    <title>{$_("stationTitle", { values: { station: stopName } })}</title>
</svelte:head>

<svelte:window on:scroll={handleScroll} bind:scrollY />

<Board>
    <h1 slot="title" class="text-3xl text-teal-400">{stopName}</h1>
    <svelte:fragment slot="items">
        {#each filteredArrivals as arrival}
            <ArrivalDisplay {arrival} />
        {/each}
    </svelte:fragment>
</Board>
