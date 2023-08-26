import type { Station } from "./Station";
import type { VehicleType } from "./VehicleType";

export interface Arrival {
    name: string;
    time: Date;
    destination: Station;
    isAtStop: boolean;
    tripId: string;
    vehicleType: VehicleType;
}
