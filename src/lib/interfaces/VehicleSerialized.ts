import type { Station } from "./Station";

export interface VehicleSerialized {
    name: string;
    type: number;
    positions: {
        lastStop?: Station;
        nextStop: Station;
        nextArrival: string;
    }[];
}
