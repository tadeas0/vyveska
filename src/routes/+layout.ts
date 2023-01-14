import { browser } from "$app/environment";
import "$lib/translation/translations"; // Import to initialize. Important :)
import { locale, waitLocale } from "svelte-i18n";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
    if (browser) {
        locale.set(window.navigator.language);
    }
    await waitLocale();
};
