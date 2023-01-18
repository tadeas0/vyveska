<script>
    import { page } from "$app/stores";
    import { _ } from "svelte-i18n";
    import Board from "$lib/components/Board.svelte";
</script>

<svelte:head>
    <title>{$_("vehicleTitle", { values: { vehicle: $page.params.vehicleId } })}</title>
</svelte:head>

<Board>
    <h1 slot="title" class="text-3xl text-teal-400">{$page.params.vehicleId}</h1>
    <h2 slot="items" class="text-xl text-emerald-400">{$_("noVehicleData")}</h2>
</Board>
