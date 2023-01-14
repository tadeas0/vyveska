<script>
    import LocaleSelect from "$lib/components/LocaleSelect.svelte";
    import Fullscreen from "$lib/Fullscreen.svelte";
    import "../app.css";
</script>

<Fullscreen>
    <LocaleSelect />
    <main class="mt-20">
        <slot />
    </main>
</Fullscreen>
