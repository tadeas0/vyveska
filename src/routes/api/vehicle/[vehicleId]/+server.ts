import { API_KEY, API_URL } from "$env/static/private";
import { findByGtfsId } from "$lib/server/stations";
import { error, json } from "@sveltejs/kit";
import type { Station } from "$lib/interfaces/Station";
import type { Vehicle } from "$lib/interfaces/Vehicle";
import type { RequestHandler } from "./$types";
import type { VehicleType } from "$lib/interfaces/VehicleType";

const DEFAULT_LIMIT = 10;

export const GET: RequestHandler = async ({ url, params, fetch }) => {
    const vehicleId = params.vehicleId;
    const limit = url.searchParams.get("limit") || DEFAULT_LIMIT;
    const offset = url.searchParams.get("offset") || 0;
    const outUrl =
        API_URL +
        "/vehiclepositions?" +
        new URLSearchParams({
            limit: limit.toString(),
            offset: offset.toString(),
            includeNotTracking: "false",
            includePositions: "true",
            routeShortName: vehicleId
        });
    const res = await fetch(outUrl, {
        headers: {
            "X-Access-Token": API_KEY
        }
    });
    const data = await res.json();

    if (data.features.length === 0) {
        throw error(404, "No data for this vehicle");
    }

    const vehicleName: string = data.features[0].properties.trip.origin_route_name;
    const vehicleType: VehicleType = data.features[0].properties.trip.vehicle_type.id;
    const positions = data.features.map((p: any) => {
        const lastId: string | null = p.properties.last_position.last_stop.id;
        const nextId: string = p.properties.last_position.next_stop.id;

        const nextStop = findByGtfsId(nextId);
        if (!nextStop) throw error(404, "station not found");
        let lastStop: Station | undefined = undefined;
        if (lastId !== null) lastStop = findByGtfsId(lastId);
        const nextArrival = new Date(p.properties.last_position.next_stop.departure_time);
        nextArrival.setSeconds(nextArrival.getSeconds() + p.properties.last_position.delay.actual);
        return {
            lastStop,
            nextStop,
            nextArrival
        };
    });

    const vehicle: Vehicle = {
        name: vehicleName,
        type: vehicleType,
        positions
    };

    return json(vehicle);
};
