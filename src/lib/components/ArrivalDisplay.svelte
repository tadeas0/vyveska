<script lang="ts">
    import { getDisplayDiff, getFormattedTime } from "$lib/common/dateUtils";
    import { currentTime } from "$lib/stores/currentTime";
    import type { Arrival } from "$lib/interfaces/Arrival";
    import { _ } from "svelte-i18n";
    import MdArrowDropDown from "svelte-icons/md/MdArrowDropDown.svelte";
    import MdArrowDropUp from "svelte-icons/md/MdArrowDropUp.svelte";
    import MdSubdirectoryArrowRight from "svelte-icons/md/MdSubdirectoryArrowRight.svelte";
    import { parseTrip } from "$lib/common/helpers";
    import type { Trip } from "$lib/interfaces/Trip";

    export let arrival: Arrival;
    export let currentStation: string = "";

    let isDropdownOpen = false;
    let icon = MdArrowDropDown;
    let trip: Trip | null = null;

    const handleShowMore = async () => {
        if (isDropdownOpen) {
            isDropdownOpen = false;
            return;
        }

        if (trip === null) {
            const res = await fetch(
                `/api/trip/${arrival.tripId}?${new URLSearchParams({
                    fromStation: currentStation
                })}`
            );
            const data = await res.json();
            trip = parseTrip(data);
        }

        isDropdownOpen = true;
    };

    $: icon = isDropdownOpen ? MdArrowDropUp : MdArrowDropDown;
</script>

<div class="py-2">
    <button class="flex w-full items-end gap-2" on:click={handleShowMore}>
        <h1 class="text-2xl text-cyan-500 hover:underline">{arrival.name}</h1>
        <span class="text-xl text-emerald-400 ">
            {arrival.destination.fullName}
        </span>
        <div class="w-8 text-white">
            <svelte:component this={icon} />
        </div>
        <span class="ml-auto rounded-3xl bg-slate-800 px-2 text-lg text-cyan-300">
            {getFormattedTime(arrival.time)}
        </span>
    </button>
    {#if arrival.isAtStop}
        <h3 class="text-lg text-gray-400">{$_("atStop")}</h3>
    {:else}
        <h3 class="text-lg  text-teal-400">
            {getDisplayDiff($currentTime, arrival.time)}
        </h3>
    {/if}
    {#if isDropdownOpen && trip !== null}
        <ul class="rounded-lg bg-slate-800 p-2">
            {#each trip.stopTimes as st}
                <li class="flex rounded-md text-lg text-white">
                    <div class="w-5 self-center text-gray-400"><MdSubdirectoryArrowRight /></div>
                    <div class="text-emerald-400">
                        {st.stationName}
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</div>
