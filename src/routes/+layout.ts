import { browser } from "$app/environment";
import { initTranslation } from "$lib/translation/translations"; // Import to initialize. Important :)
import { waitLocale } from "svelte-i18n";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async () => {
    if (browser) {
        await initTranslation();
        await waitLocale();
    }
};
