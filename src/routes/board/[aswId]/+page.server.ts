import type { PageServerLoad } from "./$types";
import { API_KEY, API_URL } from "$env/static/private";
import type { Arrival } from "src/interfaces/Arrival";
import stops from "../../../stops.json";

const ARRIVAL_NUM = 10;

export const load: PageServerLoad = async ({ params, depends, fetch }) => {
    depends("departures");

    const aswId = params.aswId;
    const res = await fetch(
        API_URL +
            "/pid/departureboards?" +
            new URLSearchParams({
                aswIds: aswId.toString(),
                limit: String(ARRIVAL_NUM * 2),
                skip: "canceled",
                order: "real",
                minutesBefore: "1",
                mode: "arrivals"
            }),
        {
            headers: {
                "X-Access-Token": API_KEY
            }
        }
    );

    const data = await res.json();
    const stopName: string = data.stops[0].stop_name;
    const currentTime = new Date();
    const arrivals: Arrival[] = data.departures
        .map((d: any) => ({
            name: d.route.short_name,
            time: new Date(d.arrival_timestamp.predicted),
            destination: d.trip.headsign,
            isAtStop: d.trip.is_at_stop
        }))
        .filter((a: any) => a.time > currentTime || a.isAtStop)
        .slice(0, ARRIVAL_NUM);

    arrivals.forEach((a) => {
        const n = stops.nodes.find((n) => n.name === a.destination || n.fullName === a.destination);
        if (n !== undefined) {
            a.node = n.node;
        }
    });

    return {
        stopName,
        arrivals
    };
};
