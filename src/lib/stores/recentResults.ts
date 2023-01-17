import { browser } from "$app/environment";
import { RECENT_RESULTS_SIZE } from "$lib/constants";
import type { SearchResult } from "$lib/interfaces/SearchResult";
import { writable } from "svelte/store";

const createRecentResults = () => {
    const storageKey = "recentResults";
    const { subscribe, update } = writable<SearchResult[]>([], (set) => {
        if (browser) {
            const stored = localStorage.getItem(storageKey);
            let recentResults: SearchResult[];
            if (!stored) recentResults = [];
            else recentResults = JSON.parse(stored);
            set(recentResults);
        }

        return () => {
            // Do nothing
        };
    });

    const addResult = (value: SearchResult) => {
        update((current) => {
            const next = [value, ...current.filter((v) => v !== value)];
            if (next.length > RECENT_RESULTS_SIZE) next.pop();
            localStorage.setItem(storageKey, JSON.stringify(next));
            return next;
        });
    };

    const removeResult = (value: SearchResult) => {
        update((current) => {
            const next = current.filter((r) => r !== value);
            localStorage.setItem(storageKey, JSON.stringify(next));
            return next;
        });
    };

    return {
        subscribe,
        addResult,
        removeResult
    };
};

export const recentResults = createRecentResults();
