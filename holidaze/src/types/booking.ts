import type { User } from "./user";
import type { Venue } from "./venue";

export interface Booking {
    id: string;
    dateFrom: string;
    dateTo: string;
    guests: number;
    created: string;
    updated: string;
    customer: User;
    venue: Venue;
}