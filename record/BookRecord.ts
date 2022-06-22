import {BookEntity, BookGenre} from "../utils/types";
import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type BookResults = [BookEntity[], FieldPacket[]];

export class BookRecord implements BookEntity {
    id?: string;
    title: string;
    genre: BookGenre | null;
    amount: number;
    year: number | null;

    constructor(obj: BookEntity) {
        this.id = obj.id ?? uuid();
        this.title = obj.title;
        this.genre = obj.genre;
        this.amount = obj.amount;
        this.year = obj.year;
    }

    async insert(): Promise<void> {
        try {
            await pool.execute("INSERT INTO `books` VALUES(:id,:title,:genre,:amount,:year)", {
                id: this.id,
                title: this.title,
                genre: this.genre,
                amount: this.amount,
                year: this.year
            })
        } catch (e) {
            console.log(e);
        }
    }

    async update(id: string): Promise<void> {
        try {
            await pool.execute("UPDATE `books` SET `title`=:title,`genre`=:genre,`amount`=:amount,`year`=:year WHERE `id`=:id", {
                id,
                title: this.title,
                genre: this.genre,
                amount: this.amount,
                year: this.year,
            })
        } catch (e) {
            console.log(e);
        }
    }

    async delete(id: string): Promise<void> {
        try {
            await pool.execute("DELETE FROM `books` WHERE `id`=:id", {
                id,
            })
        } catch (e) {
            console.log(e);
        }
    }

    static async getOne(id: string): Promise<BookRecord | null> {
        try {
            const [results] = await pool.execute("SELECT * FROM `books` where `id` = :id", {
                id
            }) as BookResults;
            return results.length !== 0 ? new BookRecord(results[0]) : null;
        } catch (e) {
            console.log(e);
        }
    }

    static async getByTitle(title: string): Promise<BookRecord[] | null> {
        const str = "'" + title + "%'";
        try {
            const [results] = await pool.execute("SELECT * FROM `books` where `title` LIKE" + str) as BookResults;

            return results.length !== 0 ? results.map(book => new BookRecord(book)) : null;
        } catch (e) {
            console.log(e);
        }
    }

    static async getAll(): Promise<BookRecord[] | null> {
        try {
            const [results] = await pool.execute("SELECT * FROM `books`") as BookResults;
            return results.length !== 0 ? results.map(book => new BookRecord(book)) : null;
        } catch (e) {
            console.log(e);
        }
    }
}