<script lang="ts">
    import { locales, locale } from "svelte-i18n";
    import MdLanguage from "svelte-icons/md/MdLanguage.svelte";

    const selectLocale = (l: string) => {
        locale.set(l);
        localStorage.setItem("locale", l);
    };
</script>

<div class="group absolute top-3 left-3 cursor-pointer uppercase">
    <div class="flex w-16 flex-row items-center bg-gray-800 p-2 text-gray-400 hover:bg-gray-700">
        <div class="mr-2 w-4"><MdLanguage /></div>
        <div>{$locale?.split("-")[0]}</div>
    </div>
    <div class="absolute hidden h-auto group-hover:block">
        <ul class="top-0">
            {#each $locales as locale}
                <li class="">
                    <button
                        class="w-16 bg-gray-400 py-2 uppercase hover:bg-gray-600 hover:text-gray-200"
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
