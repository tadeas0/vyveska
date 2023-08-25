export interface Trip {
    tripId: string;
    stopTimes: {
        time: Date;
        stationName: string;
    }[];
}
