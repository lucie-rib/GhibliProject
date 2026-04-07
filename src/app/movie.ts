export interface Movie {// This interface defines the structure of*
//  a movie object in the application.
    id: string;
    title: string;
    original_title: string;
    original_title_romanised: string;
    description: string;
    director: string;
    producer: string;
    release_date: string;
    rt_score: string;
    people: string[]; 
    species: string[];
    locations: string[];
    vehicles: string[];
    url: string;
    image: string; 
}