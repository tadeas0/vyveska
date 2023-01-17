<script>
    import LocaleSelect from "$lib/components/LocaleSelect.svelte";
    import Fullscreen from "$lib/components/Fullscreen.svelte";
    import "../app.css";
</script>

<Fullscreen>
    <LocaleSelect />
    <main class="mt-20">
        <slot />
    </main>
</Fullscreen>
