import type { PageServerLoad } from "./$types";
import { VEHICLE_NUM } from "$lib/constants";
import { parseVehicle } from "$lib/common/helpers";
import type { Vehicle } from "src/interfaces/Vehicle";
import type { VehicleSerialized } from "src/interfaces/VehicleSerialized";
import { error } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ params, fetch }) => {
    const res = await fetch(
        `/api/vehicle/${params.vehicleId}?` + new URLSearchParams({ limit: VEHICLE_NUM.toString() })
    );
    const data = await res.json();
    if (!res.ok) {
        throw error(res.status, data);
    }
    const vehParsed: Vehicle = parseVehicle(data);
    return vehParsed;
};
