import { browser } from "$app/environment";
import { init, register } from "svelte-i18n";

const defaultLocale = "en";

export const initTranslation = async () => {
    console.log("init translation");

    register("en", () => import("./locales/en.json"));
    register("cs", () => import("./locales/cs.json"));

    await init({
        fallbackLocale: defaultLocale,
        initialLocale: browser
            ? localStorage.getItem("locale") || window.navigator.language
            : defaultLocale
    });
};
