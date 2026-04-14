export interface City {
    id: number;
    country_id: number;
    name: string;
    slug: string;
    lat: number;
    lng: number;
}

export interface Location {
    id: number;
    city_id: number;
    country_id: number;
    name: string;
    address: string;
    slug: string;
    lat: number;
    lng: number;
    city?: City;
}

export interface Event {
    id: number;
    facebook_event_id: string;
    title: string;
    description: string;
    start_time: string;
    end_time: string | null;
    location_id: number;
    facebook_url: string;
    ticket_url: string | null;
    image_url: string;
    interested_count: number;
    going_count: number;
    created_by: number;
    genre: string;
    location?: Location;
    fix_day?: string;
    fix_month_name?: string;
}
