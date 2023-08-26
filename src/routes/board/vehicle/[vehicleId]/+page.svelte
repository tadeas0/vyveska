<script lang="ts">
    import { page } from "$app/stores";
    import { getDisplayDiff, getFormattedTime } from "$lib/common/dateUtils";
    import { getVehicleIcon, parseVehicle } from "$lib/common/helpers";
    import Board from "$lib/components/Board.svelte";
    import StationLink from "$lib/components/StationLink.svelte";
    import { VEHICLE_NUM } from "$lib/constants";
    import { currentTime } from "$lib/stores/currentTime";
    import type { Vehicle } from "$lib/interfaces/Vehicle";
    import { onMount } from "svelte";
    import FaLongArrowAltRight from "svelte-icons/fa/FaLongArrowAltRight.svelte";
    import { _ } from "svelte-i18n";
    import ArrivalCard from "$lib/components/ArrivalCard.svelte";
    import MdDirectionsBus from "svelte-icons/md/MdDirectionsBus.svelte";

    export let data: Vehicle;

    let vehicleIcon = MdDirectionsBus;

    $: vehicle = data;
    $: vehicleIcon = getVehicleIcon(vehicle.type);

    const fetchData = async () => {
        const res = await fetch(`/api/vehicle/${$page.params.vehicleId}?limit=${VEHICLE_NUM}`);
        const data = await res.json();
        const parsedVehicle: Vehicle = parseVehicle(data);
        vehicle = parsedVehicle;
    };

    onMount(() => {
        const fetchInterval = setInterval(fetchData, 5000);

        return () => {
            clearInterval(fetchInterval);
        };
    });
</script>

<svelte:head>
    <title>{$_("vehicleTitle", { values: { vehicle: vehicle.name } })}</title>
    <meta
        name="description"
        content={$_("vehicleDescription", { values: { vehicle: vehicle.name } })}
    />
</svelte:head>

<Board>
    <div slot="title" class="flex text-3xl text-teal-400">
        <div class="mr-2 w-9"><svelte:component this={vehicleIcon} /></div>
        <span>{data.name}</span>
    </div>
    <svelte:fragment slot="items">
        {#each vehicle.positions as position}
            <ArrivalCard>
                <div slot="title" class="flex">
                    {#if position.lastStop}
                        <h2 class="mr-2 hidden text-lg text-emerald-400 md:flex">
                            <StationLink station={position.lastStop} />
                        </h2>
                    {/if}
                    <div class="mr-2 w-4 self-center text-teal-400">
                        <FaLongArrowAltRight />
                    </div>
                    <h2 class="text-lg text-emerald-400">
                        <StationLink station={position.nextStop} />
                    </h2>
                </div>

                <div slot="right-title" class="px-2 text-cyan-300">
                    {getFormattedTime(position.nextArrival)}
                </div>

                <div slot="secondary-title" class="text-md text-teal-400">
                    {getDisplayDiff($currentTime, new Date(position.nextArrival))}
                </div>
            </ArrivalCard>
        {/each}
    </svelte:fragment>
</Board>
