import type { PageServerLoad } from "./$types";
import type { Arrival } from "src/interfaces/Arrival";
import { ARRIVAL_NUM } from "$lib/constants";
import { parseArrival } from "$lib/common/helpers";
import type { ArrivalSerialized } from "src/interfaces/ArrivalSerialized";

export const load: PageServerLoad = async ({ params, fetch }) => {
    const res = await fetch(
        `/api/departure/${params.aswId}?` +
            new URLSearchParams({ limit: (ARRIVAL_NUM * 2).toString() })
    );
    const { stopName, arrivals } = await res.json();
    const arrParsed: Arrival[] = arrivals.map((a: ArrivalSerialized) => parseArrival(a));

    return {
        stopName,
        arrivals: arrParsed
    } as { stopName: string; arrivals: Arrival[] };
};
