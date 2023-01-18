<script lang="ts">
    import { page } from "$app/stores";
    import { getDisplayDiff } from "$lib/common/dateUtils";
    import { parseVehicle } from "$lib/common/helpers";
    import Board from "$lib/components/Board.svelte";
    import StationLink from "$lib/components/StationLink.svelte";
    import { VEHICLE_NUM } from "$lib/constants";
    import { currentTime } from "$lib/stores/currentTime";
    import type { Vehicle } from "$lib/interfaces/Vehicle";
    import { onMount } from "svelte";
    import FaLongArrowAltRight from "svelte-icons/fa/FaLongArrowAltRight.svelte";
    import { _ } from "svelte-i18n";

    export let data: Vehicle;

    $: vehicle = data;

    const fetchData = async () => {
        const res = await fetch(`/api/vehicle/${$page.params.vehicleId}?limit=${VEHICLE_NUM}`);
        const data = await res.json();
        const parsedVehicle: Vehicle = parseVehicle(data);
        vehicle = parsedVehicle;
    };

    onMount(async () => {
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
    <h1 slot="title" class="text-3xl text-teal-400">{data.name}</h1>
    <svelte:fragment slot="items">
        {#each vehicle.positions as position}
            <div class="py-2">
                <div class="flex flex-row items-center gap-2">
                    {#if position.lastStop}
                        <h2 class="hidden text-xl text-emerald-400 md:flex">
                            <StationLink station={position.lastStop} />
                        </h2>
                    {/if}
                    <div class="w-4 text-teal-400">
                        <FaLongArrowAltRight />
                    </div>
                    <h2 class="text-xl text-emerald-400">
                        <StationLink station={position.nextStop} />
                    </h2>
                </div>
                <h3 class="text-xl text-teal-400">
                    {getDisplayDiff($currentTime, new Date(position.nextArrival))}
                </h3>
            </div>
        {/each}
    </svelte:fragment>
</Board>
