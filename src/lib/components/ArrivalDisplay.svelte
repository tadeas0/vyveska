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
    import ArrivalCard from "./ArrivalCard.svelte";
    import MdAccessTime from "svelte-icons/md/MdAccessTime.svelte";
    import { cubicOut } from "svelte/easing";

    export let arrival: Arrival;
    export let currentStation: string = "";

    let isDropdownOpen = false;
    let dropdownIcon = MdArrowDropDown;
    let vehicleIcon = MdDirectionsBus;
    let trip: Trip | null = null;

    const handleShowMore = () => {
        isDropdownOpen = !isDropdownOpen;
    };

    const fetchTrip = async () => {
        if (trip === null) {
            const res = await fetch(
                `/api/trip/${arrival.tripId}?${new URLSearchParams({
                    fromStation: currentStation
                })}`
            );
            const data = await res.json();
            trip = parseTrip(data);
            return trip;
        } else {
            return trip;
        }
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
    <ArrivalCard on:dropdownClick={handleShowMore} {isDropdownOpen}>
        <div slot="title" class="flex">
            <div class="mr-2 w-5 self-center text-cyan-400">
                <svelte:component this={vehicleIcon} />
            </div>
            <h1>
                <span class="mr-2 text-lg text-cyan-400">{arrival.name}</span>
                <span class="text-md text-emerald-400">{arrival.destination.fullName}</span>
            </h1>
            <div class="w-8 text-white">
                <svelte:component this={dropdownIcon} />
            </div>
        </div>

        <svelte:fragment slot="secondary-title">
            {#if arrival.isAtStop}
                <h3 class="text-md text-gray-400">{$_("atStop")}</h3>
            {:else}
                <h3 class="text-md text-teal-400">
                    {getDisplayDiff($currentTime, arrival.time)}
                </h3>
            {/if}
        </svelte:fragment>

        <div slot="right-title" class="px-2 text-cyan-300">{getFormattedTime(arrival.time)}</div>

        <svelte:fragment slot="secondary-content">
            {#await fetchTrip()}
                <div
                    transition:slide|global={{ duration: 300, easing: cubicOut }}
                    class="text-md flex animate-pulse items-center py-2 text-emerald-400"
                >
                    <div class="mr-2 w-4"><MdAccessTime /></div>
                    <span>{$_("loading")}</span>
                </div>
            {:then fetchedTrip}
                <ul class="py-2" transition:slide|global={{ duration: 300, easing: cubicOut }}>
                    {#each fetchedTrip.stopTimes as st}
                        <li class="text-md flex rounded-b-md text-white">
                            <div class="w-5 self-center text-gray-400">
                                <MdSubdirectoryArrowRight />
                            </div>
                            <div class="text-emerald-400">
                                {st.stationName}
                            </div>
                        </li>
                    {/each}
                </ul>
            {/await}
        </svelte:fragment>
    </ArrivalCard>
</div>
