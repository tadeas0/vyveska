import { initTranslation } from "$lib/translation/translations";
import { waitLocale } from "svelte-i18n";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
    await initTranslation();
    await waitLocale();
};
