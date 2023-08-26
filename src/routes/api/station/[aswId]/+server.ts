import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { API_KEY, API_URL } from "$env/static/private";
import type { Arrival } from "$lib/interfaces/Arrival";
import stops from "../../../../data/stops.json";

const DEFAULT_LIMIT = 10;

export const GET: RequestHandler = async ({ url, params }) => {
    const aswId = params.aswId;

    const limit = Number(url.searchParams.get("limit")) || DEFAULT_LIMIT;
    const offset = Number(url.searchParams.get("offset")) || 0;

    const res = await fetch(
        API_URL +
            "/pid/departureboards?" +
            new URLSearchParams({
                aswIds: aswId,
                limit: limit.toString(),
                offset: offset.toString(),
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
    const arrivals: Arrival[] = data.departures.map(
        (d: any): Arrival => ({
            name: d.route.short_name,
            time: new Date(d.arrival_timestamp.predicted),
            destination: {
                fullName: d.trip.headsign,
                names: []
            },
            isAtStop: d.trip.is_at_stop,
            tripId: d.trip.id,
            vehicleType: d.route.type
        })
    );

    arrivals.forEach((a) => {
        const n = stops.nodes.find((n) => n.names.includes(a.destination.fullName));
        if (n !== undefined) {
            a.destination = n;
        }
    });

    return json({
        stopName,
        arrivals
    });
};
