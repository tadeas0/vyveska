import { error, json } from "@sveltejs/kit";
import type { Station } from "src/interfaces/Station";
import type { RequestHandler } from "./$types";
import data from "../../../stops.json";

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
    const namePrep = stationName
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
    const filtered: Station[] = data.nodes.filter((n) => {
        const prep = n.fullName
            .toLowerCase()
            .normalize("NFD")
            .replace(/\p{Diacritic}/gu, "");
        return prep.includes(namePrep);
    });
    const sliced: Station[] = filtered.slice(skip, skip + limit);
    return json({ stations: sliced });
};
