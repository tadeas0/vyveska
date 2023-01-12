export interface Arrival {
    name: string;
    time: Date;
    destination: string;
    isAtStop: boolean;
    node?: number;
}
