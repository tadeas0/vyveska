import type { Station } from "./Station";

export interface ArrivalSerialized {
    name: string;
    time: string;
    destination: Station;
    isAtStop: boolean;
    node?: number;
}
