export interface User {
    name: string;
    email: string;
    avatar?: {
        url: string
        alt?: string;
    };
    accessToken?: string;
}