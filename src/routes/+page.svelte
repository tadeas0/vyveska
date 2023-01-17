<script lang="ts">
    import { fly } from "svelte/transition";
    import FaSearch from "svelte-icons/fa/FaSearch.svelte";
    import { goto } from "$app/navigation";
    import { _ } from "svelte-i18n";
    import type { SearchResult } from "src/interfaces/SearchResult";

    let query: string = "";
    let selected: number = 0;
    let results: SearchResult[] = [];
    let inputEl: HTMLInputElement;

    const fetchResults = async () => {
        const res = await fetch(
            "/api/search?" + new URLSearchParams({ query: query, limit: "20" })
        );
        const data = await res.json();
        results = data.results;
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            selected = (selected + 1) % results.length;
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (selected === 0) selected = results.length - 1;
            else selected = selected - 1;
        } else if (["f", "/"].includes(event.key) && !event.ctrlKey) {
            event.preventDefault();
            inputEl.focus();
        } else if (event.key === "Enter" && results.length > 0) {
            goto(results[selected].link);
        }
    };

    const handleInput = () => {
        if (query.length > 0) fetchResults();
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
                bind:value={query}
                on:input={handleInput}
                bind:this={inputEl}
                placeholder={$_("stopName")}
                class="w-full bg-transparent text-xl font-semibold text-gray-300 outline-none placeholder:text-ellipsis placeholder:text-gray-600 md:text-4xl"
            />
        </div>
        <div class="w-full">
            {#if query}
                {#key results}
                    <ul in:fly={{ y: -5, duration: 400 }}>
                        {#each results as result, i}
                            <li class="border-b-2 border-gray-700">
                                <a
                                    class="inline-block h-full w-full p-3 text-gray-300 hover:bg-gray-800 hover:underline focus:underline md:p-4"
                                    class:bg-gray-800={i === selected}
                                    class:underline={i === selected}
                                    href={result.link}
                                >
                                    <div class="flex flex-row gap-6">
                                        <h1 class="md:text-xl">{result.name}</h1>
                                        {#if result.altName}
                                            <h1 class="md:text-md text-gray-400">
                                                {result.altName}
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
