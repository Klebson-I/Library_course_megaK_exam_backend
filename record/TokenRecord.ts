import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

interface TokenRecordEntity {
    id?: string;
    token: string;
    login: string;
    password: string;
}

type TokenResults = [TokenRecordEntity[], FieldPacket[]];

export class TokenRecord implements TokenRecordEntity {
    id?: string;
    token: string;
    login: string;
    password: string;


    constructor(obj: TokenRecordEntity) {
        this.id = obj.id ?? uuid();
        this.token = obj.token;
        this.login = obj.login;
        this.password = obj.password;
    }

    static async checkIfAdmin(login: string, password: string): Promise<boolean> {
        const [results] = await pool.execute("SELECT * FROM `admintokens`") as TokenResults;
        return results.some(tokenObj => tokenObj.login === login && tokenObj.password === password);
    }

    async insert(): Promise<void> {
        try {
            await pool.execute("INSERT INTO `admintokens` VALUES(:id,:token,:login,:password)", {
                id: this.id,
                token: this.token,
                login: this.login,
                password: this.password,
            });
        } catch (e) {
            console.log(e);
        }
    }
}