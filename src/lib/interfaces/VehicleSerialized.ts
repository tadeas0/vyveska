import type { Station } from "./Station";

export interface VehicleSerialized {
    name: string;
    type: string;
    positions: {
        lastStop?: Station;
        nextStop: Station;
        nextArrival: string;
    }[];
}
