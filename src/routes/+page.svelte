<script lang="ts">
    import type { Station } from "src/interfaces/Station";
    import { fade, fly } from "svelte/transition";
    import FaSearch from "svelte-icons/fa/FaSearch.svelte";

    let stationName: string = "";
    let stations: Station[] = [];
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
</script>

<main class="py-10 px-6 flex flex-col items-center">
    <div class="w-full md:w-4/5">
        <div class="md:p-4 w-full p-2 border-b-2 border-gray-500 flex flex-row items-center">
            <div class="md:w-7 md:mr-6 w-4 mr-4 text-gray-500">
                <FaSearch />
            </div>
            <input
                bind:value={stationName}
                on:input={getStations}
                placeholder="Název stanice..."
                class="bg-transparent text-xl md:text-4xl font-semibold outline-none text-gray-300 placeholder:text-gray-600"
            />
        </div>
        <div class="w-full">
            {#if stationName}
                {#key stations}
                    <ul in:fly={{ y: -5, duration: 400 }}>
                        {#each stations as station}
                            <li
                                class="hover:bg-gray-800 text-gray-300  border-b-2 border-gray-700 hover:underline"
                            >
                                <a
                                    class="md:p-4 p-3 w-full h-full inline-block"
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
</main>
