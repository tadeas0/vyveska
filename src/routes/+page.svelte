<script lang="ts">
    import type { Station } from "src/interfaces/Station";
    import { fly } from "svelte/transition";
    import FaSearch from "svelte-icons/fa/FaSearch.svelte";
    import { goto } from "$app/navigation";
    import { _, locale } from "svelte-i18n";

    let stationName: string = "";
    let selected: number = 0;
    let stations: Station[] = [];
    let inputEl: HTMLInputElement;

    async function getStations() {
        const res = await fetch(
            "/api/station?" + new URLSearchParams({ stationName, limit: "20" }),
            {
                method: "GET"
            }
        );
        const data = await res.json();
        stations = data.stations;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowDown") {
            selected = (selected + 1) % stations.length;
        } else if (event.key === "ArrowUp") {
            if (selected === 0) selected = stations.length - 1;
            else selected = selected - 1;
        } else if (["f", "/"].includes(event.key) && !event.ctrlKey) {
            event.preventDefault();
            inputEl.focus();
        } else if (event.key === "Enter" && stations.length > 0) {
            goto(`/board/${stations[selected].node}`);
        }
    };
</script>

<svelte:body on:keydown={handleKeyDown} />

<div class="px-6 flex flex-col items-center">
    <div class="w-full md:w-4/5">
        <div class="md:p-4 w-full p-2 border-b-2 border-gray-500 flex flex-row items-center">
            <div class="md:w-7 md:mr-6 w-4 mr-4 text-gray-500">
                <FaSearch />
            </div>
            <input
                bind:value={stationName}
                on:input={getStations}
                bind:this={inputEl}
                placeholder={$_("stopName")}
                class="bg-transparent w-full text-xl md:text-4xl font-semibold outline-none text-gray-300 placeholder:text-gray-600"
            />
        </div>
        <div class="w-full">
            {#if stationName}
                {#key stations}
                    <ul in:fly={{ y: -5, duration: 400 }}>
                        {#each stations as station, i}
                            <li class="border-b-2 border-gray-700">
                                <a
                                    class="text-gray-300 md:p-4 p-3 w-full hover:bg-gray-800 focus:underline h-full inline-block"
                                    class:bg-gray-800={i === selected}
                                    class:underline={i === selected}
                                    href="/board/{station.node}"
                                >
                                    <h1 class="md:text-xl">{station.fullName}</h1>
                                </a>
                            </li>
                        {/each}
                    </ul>
                {/key}
            {/if}
        </div>
    </div>
</div>
