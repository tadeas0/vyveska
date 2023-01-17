<script lang="ts">
    import type { Station } from "$lib/interfaces/Station";

    export let station: Station;
</script>

{#if station.node}
    <a href="/board/station/{station.node}" class="hover:underline">{station.fullName}</a>
{:else}
    <span>{station.fullName}</span>
{/if}
