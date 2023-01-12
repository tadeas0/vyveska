<script lang="ts">
    import { onMount } from "svelte";
    import MdFullscreen from "svelte-icons/md/MdFullscreen.svelte";
    import MdFullscreenExit from "svelte-icons/md/MdFullscreenExit.svelte";

    let isFull = false;
    let fsContainer: HTMLDivElement | null = null;
    let fullscreenEnabled = false;

    onMount(() => {
        if (document.fullscreenEnabled) fullscreenEnabled = true;
    });

    const fsToggle = () => {
        if (!fullscreenEnabled) return;

        if (isFull) {
            document.exitFullscreen();
        } else if (fsContainer) {
            fsContainer.requestFullscreen();
        } else {
            return;
        }
        isFull = !isFull;
    };

    const fsChange = () => {
        if (document.fullscreenElement) isFull = true;
        else isFull = false;
    };

    $: icon = isFull ? MdFullscreenExit : MdFullscreen;
</script>

<div
    class="fs"
    class:w-screen={isFull}
    class:h-screen={isFull}
    class:bg-gray-900={isFull}
    bind:this={fsContainer}
    on:fullscreenchange={fsChange}
>
    <slot {isFull} />
    {#if fullscreenEnabled}
        <button
            class="top-6 right-6 translate-x-1/2 -translate-y-1/2 absolute w-10 text-gray-500 hover:w-12"
            on:click={fsToggle}
        >
            <svelte:component this={icon} />
        </button>
    {/if}
</div>
