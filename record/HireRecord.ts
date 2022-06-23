import {HireEntity, HireFullEntity} from "../utils/types";
import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";


type HireResults = [HireFullEntity[], FieldPacket[]];

export class HireRecord implements HireEntity {
    id?: string;
    user_id: string;
    book_id: string;
    expire_date: Date;

    constructor(obj: HireEntity) {
        this.id = obj.id ?? uuid();
        this.user_id = obj.user_id;
        this.book_id = obj.book_id;
        this.expire_date = obj.expire_date;
    }

    static async getAll(): Promise<null | HireFullEntity[]> {
        try {
            const [results] = await pool.execute("SELECT `hires`.`id`, `hires`.`user_id`, `hires`.`book_id`,`hires`.`expire_date`,\n" +
                "`users`.`name`,`users`.`surname`, `users`.`email`,\n" +
                "`books`.title FROM `hires`\n" +
                "INNER JOIN `users` ON `hires`.`user_id`=`users`.`id`\n" +
                "INNER JOIN `books` ON `hires`.`book_id`=`books`.`id`") as HireResults;
            return results.length > 0 ? results.map(hire => ({
                id: hire.id,
                user_id: hire.user_id,
                book_id: hire.book_id,
                expire_date: hire.expire_date,
                name: hire.name,
                surname: hire.surname,
                email: hire.email,
                title: hire.title
            })) : null;
        } catch (e) {
            console.log(e);
        }
    }

    async insert(): Promise<string> {
        try {
            await pool.execute("INSERT INTO `hires` VALUES(:id,:user_id,:book_id,:expire_date)", {
                id: this.id,
                user_id: this.user_id,
                book_id: this.book_id,
                expire_date: this.expire_date
            })
            return this.id;
        } catch (e) {
            console.log(e);
        }
    }
}