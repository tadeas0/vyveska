import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { prepName } from "$lib/server/stringUtils";
import routes from "../../../data/routes.json";

const DEFAULT_LIMIT = 10;

export const GET: RequestHandler = async ({ url }) => {
    const vehicleName = url.searchParams.get("vehicleName");
    const limit = Number(url.searchParams.get("limit")) || DEFAULT_LIMIT;

    if (!vehicleName) throw error(400, "invalid vehicle name");
    const query = prepName(vehicleName);
    const results = routes.routes.filter((r) => prepName(r.name).includes(query)).slice(0, limit);
    return json({ vehicles: results });
};
