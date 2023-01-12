<script lang="ts">
    import type { Station } from "src/interfaces/Station";
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

<main class="p-10 flex flex-col items-center">
    <div class="flex flex-col items-center justify-center w-full md:w-5/6">
        <div class="p-4 w-3/5 border-b-2 border-gray-500 flex flex-row items-center">
            <div class="w-8 mr-6 text-gray-500">
                <FaSearch />
            </div>
            <input
                bind:value={stationName}
                on:input={getStations}
                placeholder="Název stanice..."
                class="bg-transparent text-4xl font-semibold outline-none text-gray-300 placeholder:text-gray-600"
            />
        </div>
        <div class="w-4/6 mt-10">
            {#if stationName && stations.length > 0}
                <ul>
                    {#each stations as station}
                        <li
                            class="hover:bg-gray-800 text-gray-300  border-b-2 border-gray-700 hover:underline"
                        >
                            <a class="p-4 w-full h-full inline-block" href="/board/{station.node}">
                                <h1 class="text-2xl">{station.fullName}</h1>
                            </a>
                        </li>
                    {/each}
                </ul>
            {/if}
        </div>
    </div>
</main>
