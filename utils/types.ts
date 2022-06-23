export interface UserRecordEntity {
    id?: string;
    name: string;
    surname: string;
    city: string;
    address: string;
    phone: number;
    email: string;
    is_admin: boolean;
    login: string;
    password: string;
}

export interface TokenRecordEntity {
    id?: string;
    token: string;
    login: string;
    password: string;
}

export type BookGenre =
    'sci-fi' |
    'novel' |
    'drama' |
    'comedy' |
    'historical' |
    'science' |
    'gangster novel' |
    'absurdist' |
    'fantasy' |
    'adventure' |
    'criminal' |
    'horror' |
    'thriller' |
    'comics' |
    'philosophy';


export interface BookEntity {
    id?: string;
    title: string;
    genre: BookGenre | null;
    amount: number;
    year: number | null;
}

export interface AuthorEntity {
    id?: string;
    name: string;
    surname: string;
    book_id: string;
}
