import { error, json } from "@sveltejs/kit";
import type { Station } from "src/interfaces/Station";
import type { RequestHandler } from "./$types";
import data from "../../../data/stops.json";
import { prepName } from "$lib/server/stringUtils";

const DEFAULT_LIMIT = 10;
const DEFAULT_SKIP = 0;

export const GET: RequestHandler = async ({ url }) => {
    const stationName = url.searchParams.get("stationName");
    if (stationName === null) {
        throw error(400, {
            message: "missing stationName"
        });
    }
    const skipStr = url.searchParams.get("skip");
    const limitStr = url.searchParams.get("limit");
    const skip = skipStr ? Number(skipStr) : DEFAULT_SKIP;
    const limit = limitStr ? Number(limitStr) : DEFAULT_LIMIT;
    const namePrep = prepName(stationName);
    const filtered: Station[] = data.nodes.filter((n) => {
        const prepNames = n.names.map(prepName);
        return prepNames.some((prep) => prep.includes(namePrep));
    });
    const sliced: Station[] = filtered.slice(skip, skip + limit);
    return json({ stations: sliced });
};
