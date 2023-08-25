<script lang="ts">
    import { getDisplayDiff, getFormattedTime } from "$lib/common/dateUtils";
    import { currentTime } from "$lib/stores/currentTime";
    import type { Arrival } from "$lib/interfaces/Arrival";
    import { _ } from "svelte-i18n";
    import StationLink from "./StationLink.svelte";

    export let arrival: Arrival;
</script>

<div class="py-2">
    <div class="flex w-full items-end gap-2">
        <a class="text-2xl text-cyan-500 hover:underline" href="/board/vehicle/{arrival.name}"
            >{arrival.name}</a
        >
        <span class="text-xl text-emerald-400 ">
            <StationLink station={arrival.destination} />
        </span>
        <span class="ml-auto rounded-3xl bg-slate-800 px-2 text-lg text-cyan-300">
            {getFormattedTime(arrival.time)}
        </span>
    </div>
    {#if arrival.isAtStop}
        <h3 class="text-lg text-gray-400">{$_("atStop")}</h3>
    {:else}
        <h3 class="text-lg  text-teal-400">
            {getDisplayDiff($currentTime, arrival.time)}
        </h3>
    {/if}
</div>
