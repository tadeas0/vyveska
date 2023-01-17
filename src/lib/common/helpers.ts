import type { Arrival } from "$lib/interfaces/Arrival";
import type { ArrivalSerialized } from "$lib/interfaces/ArrivalSerialized";
import type { Vehicle } from "$lib/interfaces/Vehicle";
import type { VehicleSerialized } from "$lib/interfaces/VehicleSerialized";

export const parseArrival = (arrivalJson: ArrivalSerialized): Arrival => ({
    destination: arrivalJson.destination,
    isAtStop: arrivalJson.isAtStop,
    name: arrivalJson.name,
    time: new Date(arrivalJson.time)
});

export const parseVehicle = (vehicleJson: VehicleSerialized): Vehicle => ({
    name: vehicleJson.name,
    type: vehicleJson.type,
    positions: vehicleJson.positions.map((v) => ({
        nextArrival: new Date(v.nextArrival),
        nextStop: v.nextStop,
        lastStop: v.lastStop
    }))
});
