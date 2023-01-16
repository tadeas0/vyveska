import type { PageServerLoad } from "./$types";
import { VEHICLE_NUM } from "$lib/constants";
import { parseVehicle } from "$lib/common/helpers";
import type { Vehicle } from "src/interfaces/Vehicle";
import type { VehicleSerialized } from "src/interfaces/VehicleSerialized";

export const load: PageServerLoad = async ({ params, fetch }) => {
    const res = await fetch(
        `/api/vehicle/${params.vehicleId}?` + new URLSearchParams({ limit: VEHICLE_NUM.toString() })
    );
    const vehicle: VehicleSerialized = await res.json();
    const vehParsed: Vehicle = parseVehicle(vehicle);

    return vehParsed;
};
