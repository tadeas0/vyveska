<script lang="ts">
    import { createEventDispatcher } from "svelte";

    const handleClick = () => {
        dispatch("dropdownClick");
    };
    const dispatch = createEventDispatcher();

    export let isDropdownOpen = false;
</script>

<div>
    <button
        on:click={handleClick}
        class="group w-full rounded-md bg-slate-800 p-2 text-left hover:bg-slate-700"
        class:rounded-b-none={isDropdownOpen}
    >
        <div class="flex items-center">
            <div>
                <slot name="title" />
            </div>
            <div />
            <div class="ml-auto">
                <slot name="right-title" />
            </div>
        </div>
        <slot name="secondary-title" />
    </button>
    {#if isDropdownOpen}
        <div class="rounded-b-md bg-slate-800 px-2">
            <slot name="secondary-content" />
        </div>
    {/if}
</div>
