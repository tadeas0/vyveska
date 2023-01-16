import type { Station } from "./Station";

export interface Vehicle {
    name: string;
    type: string;
    positions: {
        lastStop?: Station;
        nextStop: Station;
        nextArrival: Date;
    }[];
}
