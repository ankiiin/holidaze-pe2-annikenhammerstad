import type { Booking } from "./booking";

export interface Venue {
    id: string;
    name: string;
    description: string;
    media?: {
        url: string;
        alt?: string;
    }[];
    price: number;
    maxGuests: number;
    rating?: number;
    created: string;
    updated: string;
    meta: {
        wifi: boolean;
        parking: boolean;
        breakfast: boolean;
        pets: boolean;
    };
    location: {
        adress: string;
        city?: string;
        zip?: string;
        country?: string;
        lat?: number;
        lng?: number;
    };
    owner: {
        name: string;
        email: string;
        avatar?: {
            url: string;
            alt?: string;
        };
    };
    bookings?: Booking[];
}

export interface VenueListResponse {
    data: Venue[];
    meta: {
        totalCount: number;
    };
}