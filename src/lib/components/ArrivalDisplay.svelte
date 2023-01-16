<script lang="ts">
    import { getDisplayDiff } from "$lib/common/dateUtils";
    import { currentTime } from "$lib/stores/currentTime";
    import type { Arrival } from "src/interfaces/Arrival";
    import { _ } from "svelte-i18n";
    import StationLink from "./StationLink.svelte";

    export let arrival: Arrival;
</script>

<div class="py-2">
    <h2>
        <span class="text-2xl text-cyan-500">{arrival.name}</span>
        <span class="ml-2 text-xl text-emerald-400 ">
            <StationLink station={arrival.destination} />
        </span>
    </h2>
    {#if arrival.isAtStop}
        <h3 class="text-lg text-gray-400">{$_("atStop")}</h3>
    {:else}
        <h3 class="text-lg">
            {getDisplayDiff($currentTime, arrival.time)}
        </h3>
    {/if}
</div>
