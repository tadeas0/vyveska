import type { Station } from "./Station";

export interface Arrival {
    name: string;
    time: Date;
    destination: Station;
    isAtStop: boolean;
    tripId: string;
}
