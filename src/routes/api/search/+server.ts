import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import routes from "../../../data/routes.json";
import stops from "../../../data/stops.json";
import { prepName } from "$lib/server/stringUtils";
import type { SearchResult } from "$lib/interfaces/SearchResult";

const DEFAULT_LIMIT = 10;

export const GET: RequestHandler = async ({ url }) => {
    const query = url.searchParams.get("query");
    if (query === null) {
        throw error(400, "missing stationName");
    }
    const skip = Number(url.searchParams.get("skip")) || 0;
    const limit = Number(url.searchParams.get("limit")) || DEFAULT_LIMIT;
    const queryPrep = prepName(query);
    const stationRes: SearchResult[] = stops.nodes
        .filter((n) => {
            const prepNames = n.names.map(prepName);
            return prepNames.some((prep) => prep.includes(queryPrep));
        })
        .map((s) => ({
            name: s.fullName,
            link: `/board/station/${s.node}`,
            altName: [...new Set(s.lines.map((l) => l.name))].join(", ")
        }));
    const routeRes: SearchResult[] = routes.routes
        .filter((r) => r.name.includes(queryPrep))
        .map((r) => ({
            name: r.name,
            altName: r.longName || undefined,
            link: `/board/vehicle/${r.name}`
        }));

    const results = [...stationRes, ...routeRes].slice(skip, limit);

    return json({ results: results });
};
