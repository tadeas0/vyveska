<script lang="ts">
    import { locales, locale } from "svelte-i18n";
    import MdLanguage from "svelte-icons/md/MdLanguage.svelte";
    let isOpen = false;

    const selectLocale = (l: string) => {
        locale.set(l);
        localStorage.setItem("locale", l);
    };

    const handleClick = () => {
        isOpen = !isOpen;
    };
</script>

<div class="group absolute left-3 top-3 cursor-pointer uppercase">
    <button
        class="flex w-16 flex-row items-center bg-gray-800 p-2 text-lg uppercase text-gray-400 hover:bg-gray-700"
        on:click={handleClick}
    >
        <span class="mr-2 w-4"><MdLanguage /></span>
        <span>{$locale?.split("-")[0]}</span>
    </button>
    <div
        class="absolute hidden h-auto group-hover:block"
        class:hidden={!isOpen}
        class:block={isOpen}
    >
        <ul class="top-0">
            {#each $locales as locale}
                <li>
                    <button
                        class="w-16 bg-gray-400 py-2 uppercase hover:bg-gray-600 hover:text-gray-200"
                        on:click={() => {
                            selectLocale(locale);
                            isOpen = false;
                        }}
                        value={locale}>{locale}</button
                    >
                </li>
            {/each}
        </ul>
    </div>
</div>
