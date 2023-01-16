<script>
    import { page } from "$app/stores";
    import Board from "$lib/components/Board.svelte";
</script>

<Board>
    <h1 slot="title" class="text-3xl text-teal-400">{$page.params.vehicleId}</h1>
    <h2 slot="items" class="text-xl text-emerald-400">{$page.error?.message}</h2>
</Board>
