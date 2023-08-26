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
    import MdAccessTime from "svelte-icons/md/MdAccessTime.svelte";

    export let data: PageServerData;

    $: ({ arrivals, stopName } = data);
    $: filteredArrivals = arrivals
        .filter((a) => a.time > $currentTime || a.isAtStop)
        .slice(0, pageNum * ARRIVAL_NUM);

    let pageNum = 1;
    let noMoreArrivals = false;
    let scrollY: number;
    let isLoadingMore = false;

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

    onMount(() => {
        const fetchInterval = setInterval(fetchData, 5000);

        return () => {
            clearInterval(fetchInterval);
        };
    });

    const handleScroll = async (e: Event) => {
        if (isLoadingMore || noMoreArrivals) return;
        const threshold = 50;

        if (window.innerHeight + window.scrollY > document.body.offsetHeight - threshold) {
            pageNum += 1;
            isLoadingMore = true;
            await fetchData();
            isLoadingMore = false;
        }
    };
</script>

<svelte:head>
    <title>{$_("stationTitle", { values: { station: stopName } })}</title>
    <meta
        name="description"
        content={$_("stationDescription", { values: { station: stopName } })}
    />
</svelte:head>

<svelte:window on:scroll={(e) => handleScroll(e)} />

<Board>
    <h1 slot="title" class="text-3xl text-teal-400">{stopName}</h1>
    <svelte:fragment slot="items">
        {#each filteredArrivals as arrival}
            <ArrivalDisplay {arrival} currentStation={stopName} />
        {/each}
    </svelte:fragment>
</Board>
{#if noMoreArrivals}
    <div class="my-4 flex w-full items-center justify-center text-teal-400">
        {$_("noMoreArrivals")}
    </div>
{:else}
    <div class="my-4 flex w-full animate-pulse items-center justify-center text-teal-200">
        <div class="mr-2 h-6">
            <MdAccessTime />
        </div>
        <div class="text-lg">{$_("loadingMoreArrivals")}</div>
    </div>
{/if}
