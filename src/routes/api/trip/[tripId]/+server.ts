import { API_KEY, API_URL } from "$env/static/private";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import type { Trip } from "$lib/interfaces/Trip";

export const GET: RequestHandler = async ({ url, params }) => {
    const tripId = params.tripId;
    const fromStation = url.searchParams.get("fromStation");

    const reqUrl =
        API_URL +
        `/gtfs/trips/${tripId}?` +
        new URLSearchParams({
            includeStops: "true",
            includeStopTimes: "true",
            includeRoute: "true",
            date: "2023-08-25"
        });
    const res = await fetch(reqUrl, {
        headers: {
            "X-Access-Token": API_KEY
        }
    });
    const data = await res.json();

    const stopTimes: { stationName: string; time: Date }[] = data.stop_times.map((st: any) => {
        const time = new Date();
        const strTime: string = st.arrival_time;
        const [h, m, s] = strTime.split(":");
        time.setHours(Number(h));
        time.setMinutes(Number(m));
        time.setSeconds(Number(s));
        return {
            stationName: st.stop.properties.stop_name,
            time
        };
    });
    const fromIndex = stopTimes.findIndex((st) => st.stationName === fromStation);
    const fromIndexClamp = Math.max(fromIndex, 0);
    const stopTimesSlice = stopTimes.slice(fromIndexClamp);

    const trip: Trip = {
        tripId,
        stopTimes: stopTimesSlice
    };

    return json(trip);
};
