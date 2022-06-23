import {AuthorEntity} from "../utils/types";
import {v4 as uuid} from 'uuid';
import {FieldPacket} from "mysql2";
import {pool} from "../utils/db";

type AuthorResults = [AuthorEntity[], FieldPacket[]];

export class AuthorRecord implements AuthorEntity {
    id?: string;
    name: string;
    surname: string;
    book_id: string;

    constructor(obj: AuthorEntity) {
        this.id = obj.id ?? uuid();
        this.name = obj.name;
        this.surname = obj.surname;
        this.book_id = obj.book_id;
    }

    static async getOne(id: string): Promise<AuthorRecord | null> {
        try {
            const [results] = await pool.execute("SELECT * FROM `authors` where `id` = :id", {
                id
            }) as AuthorResults;
            return results.length !== 0 ? new AuthorRecord(results[0]) : null;
        } catch (e) {
            console.log(e);
        }
    }

    static async getAll(): Promise<AuthorRecord[] | null> {
        try {
            const [results] = await pool.execute("SELECT * FROM `authors`") as AuthorResults;
            return results.length !== 0 ? results.map(author => new AuthorRecord(author)) : null;
        } catch (e) {
            console.log(e);
        }
    }

    async insert(): Promise<string> {
        try {
            await pool.execute("INSERT INTO `authors` VALUES(:id,:name,:surname,:book_id)", {
                id: this.id,
                name: this.name,
                surname: this.surname,
                book_id: this.book_id
            })
            return this.id;
        } catch (e) {
            console.log(e);
        }
    }

    async update(): Promise<void> {
        try {
            await pool.execute("UPDATE `authors` SET `name`=:name,`surname`=:surname,`book_id`=:book_id WHERE `id`=:id", {
                id: this.id,
                name: this.name,
                surname: this.surname,
                book_id: this.book_id
            })
        } catch (e) {
            console.log(e);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await pool.execute("DELETE FROM `authors` WHERE `id`=:id", {
                id
            })
        } catch (e) {
            console.log(e);
        }
    }
}