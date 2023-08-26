<script lang="ts">
    import { getDisplayDiff, getFormattedTime } from "$lib/common/dateUtils";
    import { currentTime } from "$lib/stores/currentTime";
    import type { Arrival } from "$lib/interfaces/Arrival";
    import { _ } from "svelte-i18n";
    import MdArrowDropDown from "svelte-icons/md/MdArrowDropDown.svelte";
    import MdArrowDropUp from "svelte-icons/md/MdArrowDropUp.svelte";
    import MdDirectionsBus from "svelte-icons/md/MdDirectionsBus.svelte";
    import MdSubdirectoryArrowRight from "svelte-icons/md/MdSubdirectoryArrowRight.svelte";
    import MdDirectionsSubway from "svelte-icons/md/MdDirectionsSubway.svelte";
    import MdTram from "svelte-icons/md/MdTram.svelte";
    import MdTrain from "svelte-icons/md/MdTrain.svelte";
    import MdDirectionsBoat from "svelte-icons/md/MdDirectionsBoat.svelte";
    import { parseTrip } from "$lib/common/helpers";
    import type { Trip } from "$lib/interfaces/Trip";
    import { slide } from "svelte/transition";
    import { VehicleType } from "$lib/interfaces/VehicleType";

    export let arrival: Arrival;
    export let currentStation: string = "";

    let isDropdownOpen = false;
    let dropdownIcon = MdArrowDropDown;
    let vehicleIcon = MdDirectionsBus;
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

    $: dropdownIcon = isDropdownOpen ? MdArrowDropUp : MdArrowDropDown;
    $: switch (arrival.vehicleType) {
        case VehicleType.Bus:
            vehicleIcon = MdDirectionsBus;
            break;
        case VehicleType.Tram:
            vehicleIcon = MdTram;
            break;
        case VehicleType.Metro:
            vehicleIcon = MdDirectionsSubway;
            break;
        case VehicleType.Train:
            vehicleIcon = MdTrain;
            break;
        case VehicleType.Ferry:
            vehicleIcon = MdDirectionsBoat;
            break;
        case VehicleType.Funicular:
            vehicleIcon = MdTram;
            break;
        case VehicleType.Trolleybus:
            vehicleIcon = MdDirectionsBus;
            break;
        default:
            vehicleIcon = MdDirectionsBus;
            break;
    }
</script>

<div>
    <button
        class="group w-full rounded-md bg-slate-800 p-2 text-left hover:bg-slate-700"
        class:rounded-b-none={isDropdownOpen}
        on:click={handleShowMore}
    >
        <div class="flex w-full items-center">
            <span class="mr-2 w-5 self-center text-cyan-400">
                <svelte:component this={vehicleIcon} />
            </span>
            <h1 class="text-lg text-cyan-500 group-hover:underline">{arrival.name}</h1>
            <span
                class="text-md ml-2 overflow-hidden text-left text-emerald-400 group-hover:underline"
            >
                {arrival.destination.fullName}
            </span>
            <div class="w-8 text-white">
                <svelte:component this={dropdownIcon} />
            </div>
            <span class="text-md ml-auto px-2 text-cyan-300">
                {getFormattedTime(arrival.time)}
            </span>
        </div>
        {#if arrival.isAtStop}
            <h3 class="text-md text-gray-400 group-hover:underline">{$_("atStop")}</h3>
        {:else}
            <h3 class="text-md text-teal-400 group-hover:underline">
                {getDisplayDiff($currentTime, arrival.time)}
            </h3>
        {/if}
    </button>
    {#if isDropdownOpen && trip !== null}
        <ul transition:slide={{ duration: 200 }} class="rounded-b-md bg-slate-800 p-2">
            {#each trip.stopTimes as st}
                <li class="flex rounded-b-md text-lg text-white">
                    <div class="w-5 self-center text-gray-400"><MdSubdirectoryArrowRight /></div>
                    <div class="text-emerald-400">
                        {st.stationName}
                    </div>
                </li>
            {/each}
        </ul>
    {/if}
</div>
