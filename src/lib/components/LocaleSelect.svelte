<script lang="ts">
    import { locales, locale } from "svelte-i18n";
    import MdLanguage from "svelte-icons/md/MdLanguage.svelte";

    const selectLocale = (l: string) => {
        locale.set(l);
    };
</script>

<div class="group absolute cursor-pointer uppercase top-3 left-3">
    <div class="bg-gray-800 p-2 w-16 hover:bg-gray-700 flex flex-row text-gray-400 items-center">
        <div class="w-4 mr-2"><MdLanguage /></div>
        <div>{$locale?.split("-")[0]}</div>
    </div>
    <div class="group-hover:block absolute hidden h-auto">
        <ul class="top-0">
            {#each $locales as locale}
                <li class="">
                    <button
                        class="uppercase hover:text-gray-200 py-2 bg-gray-400 hover:bg-gray-600 w-16"
                        on:click={() => {
                            selectLocale(locale);
                        }}
                        value={locale}>{locale}</button
                    >
                </li>
            {/each}
        </ul>
    </div>
</div>
