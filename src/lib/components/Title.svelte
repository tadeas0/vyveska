<script lang="ts">
    import { expoInOut } from "svelte/easing";
    import { fade, slide } from "svelte/transition";

    export const animate: boolean = true;
</script>

<span transition:fade|local={{ duration: 100, easing: expoInOut }}>
    <h1
        class="mb-16 mt-10 text-center text-6xl font-extrabold uppercase tracking-wide text-gray-200 md:text-5xl"
        transition:slide|local={{ duration: 200 }}
    >
        Vývěska
    </h1>
</span>
