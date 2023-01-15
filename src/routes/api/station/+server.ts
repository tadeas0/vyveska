import { error, json } from "@sveltejs/kit";
import type { Station } from "src/interfaces/Station";
import type { RequestHandler } from "./$types";
import data from "../../../stops.json";

const DEFAULT_LIMIT = 10;
const DEFAULT_SKIP = 0;

const prepName = (stationName: string): string => {
    return stationName
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "") // replace diacritic
        .replace(/[\W_]+/g, " ") // replace nonaplhanumeric
        .replace(/\s\s+/g, " "); // replace multiple whitespace chars
};

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
        const prepFull = prepName(n.fullName);
        const prep = prepName(n.name);
        return prepFull.includes(namePrep) || prep.includes(namePrep);
    });
    const sliced: Station[] = filtered.slice(skip, skip + limit);
    return json({ stations: sliced });
};
