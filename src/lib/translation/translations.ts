import { browser } from "$app/environment";
import { init, register } from "svelte-i18n";

const defaultLocale = "cs";

register("en", () => import("./locales/en.json"));
register("cs", () => import("./locales/cs.json"));

init({
    fallbackLocale: defaultLocale,
    initialLocale: browser ? window.navigator.language : defaultLocale
});
