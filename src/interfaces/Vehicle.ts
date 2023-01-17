import type { Station } from "./Station";

export interface Vehicle {
    name: string;
    type: string;
    positions: Position[];
}

export interface Position {
    lastStop?: Station;
    nextStop: Station;
    nextArrival: Date;
}
