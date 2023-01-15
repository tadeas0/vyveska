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

<div class="flex flex-col items-center px-6">
    <div class="w-full md:w-4/5">
        <div class="flex w-full flex-row items-center border-b-2 border-gray-500 p-2 md:p-4">
            <div class="mr-4 w-4 text-gray-500 md:mr-6 md:w-7">
                <FaSearch />
            </div>
            <input
                bind:value={stationName}
                on:input={getStations}
                bind:this={inputEl}
                placeholder={$_("stopName")}
                class="w-full bg-transparent text-xl font-semibold text-gray-300 outline-none placeholder:text-gray-600 md:text-4xl"
            />
        </div>
        <div class="w-full">
            {#if stationName}
                {#key stations}
                    <ul in:fly={{ y: -5, duration: 400 }}>
                        {#each stations as station, i}
                            <li class="border-b-2 border-gray-700">
                                <a
                                    class="inline-block h-full w-full p-3 text-gray-300 hover:bg-gray-800 focus:underline md:p-4"
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
