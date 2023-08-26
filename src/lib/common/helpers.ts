import type { Arrival } from "$lib/interfaces/Arrival";
import type { ArrivalSerialized } from "$lib/interfaces/ArrivalSerialized";
import type { Trip } from "$lib/interfaces/Trip";
import type { TripSerialized } from "$lib/interfaces/TripSerialized";
import type { Vehicle } from "$lib/interfaces/Vehicle";
import type { VehicleSerialized } from "$lib/interfaces/VehicleSerialized";
import { VehicleType } from "$lib/interfaces/VehicleType";

export const parseArrival = (arrivalJson: ArrivalSerialized): Arrival => ({
    destination: arrivalJson.destination,
    isAtStop: arrivalJson.isAtStop,
    name: arrivalJson.name,
    time: new Date(arrivalJson.time),
    tripId: arrivalJson.tripId,
    vehicleType: arrivalJson.vehicleType
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

export const parseTrip = (tripJson: TripSerialized): Trip => ({
    tripId: tripJson.tripId,
    stopTimes: tripJson.stopTimes.map((st) => ({
        time: new Date(st.time),
        stationName: st.stationName
    }))
});
