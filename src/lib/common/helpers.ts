import type { Arrival } from "src/interfaces/Arrival";
import type { ArrivalSerialized } from "src/interfaces/ArrivalSerialized";

export const parseArrival = (arrivalJson: ArrivalSerialized): Arrival => ({
    destination: arrivalJson.destination,
    isAtStop: arrivalJson.isAtStop,
    name: arrivalJson.name,
    time: new Date(arrivalJson.time),
    node: arrivalJson.node
});
