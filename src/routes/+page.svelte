<script lang="ts">
    import type { Station } from "src/interfaces/Station";
    import { fly } from "svelte/transition";
    import FaSearch from "svelte-icons/fa/FaSearch.svelte";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";

    let stationName: string = "";
    let selected: number = 0;
    let stations: Station[] = [];
    let vehicles: { longName: string; name: string }[] = [];
    let inputEl: HTMLInputElement;

    $: items = [
        ...stations.map((s) => ({ name: s.fullName, link: `/board/station/${s.node}` })),
        ...vehicles.map((v) => ({
            name: v.name,
            longName: v.longName,
            link: `/board/vehicle/${v.name}`
        }))
    ] as { name: string; link: string; longName?: string }[];

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

    async function getVehicles() {
        const res = await fetch(
            "/api/vehicle?" + new URLSearchParams({ vehicleName: stationName, limit: "20" })
        );
        const data = await res.json();
        vehicles = data.vehicles;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            selected = (selected + 1) % items.length;
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (selected === 0) selected = items.length - 1;
            else selected = selected - 1;
        } else if (["f", "/"].includes(event.key) && !event.ctrlKey) {
            event.preventDefault();
            inputEl.focus();
        } else if (event.key === "Enter" && items.length > 0) {
            goto(items[selected].link);
        }
    };

    const handleInput = async () => {
        if (stationName.length > 0) await Promise.all([getStations(), getVehicles()]);
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
                on:input={handleInput}
                bind:this={inputEl}
                placeholder={$_("stopName")}
                class="w-full bg-transparent text-xl font-semibold text-gray-300 outline-none placeholder:text-ellipsis placeholder:text-gray-600 md:text-4xl"
            />
        </div>
        <div class="w-full">
            {#if stationName}
                {#key stations}
                    <ul in:fly={{ y: -5, duration: 400 }}>
                        {#each items as item, i}
                            <li class="border-b-2 border-gray-700">
                                <a
                                    class="inline-block h-full w-full p-3 text-gray-300 hover:bg-gray-800 hover:underline focus:underline md:p-4"
                                    class:bg-gray-800={i === selected}
                                    class:underline={i === selected}
                                    href={item.link}
                                >
                                    <div class="flex flex-row gap-6">
                                        <h1 class="md:text-xl">{item.name}</h1>
                                        {#if item.longName}
                                            <h1 class="md:text-md text-gray-400">
                                                {item.longName}
                                            </h1>
                                        {/if}
                                    </div>
                                </a>
                            </li>
                        {/each}
                    </ul>
                {/key}
            {/if}
        </div>
    </div>
</div>
