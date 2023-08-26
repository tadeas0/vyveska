import type { Station } from "./Station";

export interface ArrivalSerialized {
    name: string;
    time: string;
    destination: Station;
    isAtStop: boolean;
    tripId: string;
    node?: number;
    vehicleType: number;
}
