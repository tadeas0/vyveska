export interface TripSerialized {
    tripId: string;
    stopTimes: {
        time: string;
        stationName: string;
    }[];
}
