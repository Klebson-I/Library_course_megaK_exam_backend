import {createPool} from 'mysql2/promise';

export const pool = createPool({
    decimalNumbers: true,
    namedPlaceholders: true,
    database: 'library',
    host: 'localhost',
    user: 'root'
})