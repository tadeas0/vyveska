import type { Station } from "./Station";
import type { VehicleType } from "./VehicleType";

export interface Vehicle {
    name: string;
    type: VehicleType;
    positions: Position[];
}

export interface Position {
    lastStop?: Station;
    nextStop: Station;
    nextArrival: Date;
}
