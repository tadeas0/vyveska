import { browser } from "$app/environment";
import { init, register } from "svelte-i18n";

const defaultLocale = "en";

export const initTranslation = async () => {
    console.log("init translation");

    let loc: string;
    if (browser) {
        register("en", () => import("./locales/en.json"));
        register("cs", () => import("./locales/cs.json"));
        loc = localStorage.getItem("locale") || window.navigator.language;
    } else {
        register("en", () => import("./locales/en-static.json"));
        register("cs", () => import("./locales/cs-static.json"));
        loc = defaultLocale;
    }

    await init({
        fallbackLocale: defaultLocale,
        initialLocale: loc
    });
};
