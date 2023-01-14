import { browser } from "$app/environment";
import "$lib/translation/translations"; // Import to initialize. Important :)
import { locale, waitLocale } from "svelte-i18n";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
    if (browser) {
        const lang = localStorage.getItem("locale") || window.navigator.language;
        locale.set(lang);
    }
    await waitLocale();
};
