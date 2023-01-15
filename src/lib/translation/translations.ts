import { browser } from "$app/environment";
import { addMessages, init } from "svelte-i18n";
import en from "./locales/en.json";
import cs from "./locales/cs.json";

const defaultLocale = "en";

export const initTranslation = async () => {
    console.log("init translation");

    addMessages("en", en);
    addMessages("cs", cs);

    await init({
        fallbackLocale: defaultLocale,
        initialLocale: browser
            ? localStorage.getItem("locale") || window.navigator.language
            : defaultLocale
    });
};
