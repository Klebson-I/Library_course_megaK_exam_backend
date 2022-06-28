import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {TokenRecordEntity} from "../utils/types";


type TokenResults = [TokenRecordEntity[], FieldPacket[]];

export class TokenRecord implements TokenRecordEntity {
    id?: string;
    login: string;
    password: string;


    constructor(obj: TokenRecordEntity) {
        this.id = obj.id ?? uuid();
        this.login = obj.login;
        this.password = obj.password;
    }

    static async checkIfAdmin(login: string, password: string): Promise<boolean> {
        const [results] = await pool.execute("SELECT * FROM `admintokens`") as TokenResults;
        const isAdmin = results.some(tokenObj => tokenObj.login === login && tokenObj.password === password);
        if (isAdmin) {
            const resultObj = results.find(tokenObj => tokenObj.login === login && tokenObj.password === password);
            const token = new TokenRecord(resultObj);
            await token.delete();
        }
        return isAdmin;
    }

    static async getOneByLoginAndPassword(login: string, password: string): Promise<TokenRecord | null> {
        try {
            const [results] = await pool.execute("SELECT * FROM `admintokens` WHERE `login`=:login AND `password`=:password", {
                login,
                password
            }) as TokenResults;
            return results.length !== 0 ? new TokenRecord(results[0]) : null;
        } catch (e) {
            console.log(e);
        }
    }

    async insert(): Promise<string> {
        try {
            await pool.execute("INSERT INTO `admintokens` VALUES(:id,:login,:password)", {
                id: this.id,
                login: this.login,
                password: this.password,
            });
            return this.id;
        } catch (e) {
            console.log(e);
        }
    }

    async delete(): Promise<void> {
        try {
            await pool.execute("DELETE FROM `admintokens` WHERE `id`=:id", {
                id: this.id
            });
        } catch (e) {
            console.log(e);
        }
    }
}