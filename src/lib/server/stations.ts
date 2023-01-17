import type { Station } from "src/interfaces/Station";
import stops from "../../data/stops.json";

export const findByName = (name: string): Station | undefined => {
    return stops.nodes.find((n) => n.names.includes(name));
};

export const findByGtfsId = (id: string): Station | undefined => {
    return stops.nodes.find((n) => n.gtfsIds.includes(id));
};
