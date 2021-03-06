import {v4 as uuid} from 'uuid';
import {pool} from '../utils/db';
import {UserError} from "../Errors/UserError";
import {FieldPacket} from "mysql2";
import {UserRecordEntity} from "../utils/types";


type UserDataToValidateIsAlreadyExist = Pick<UserRecordEntity, 'name' | 'surname' | 'login' | 'password'>;

type UserResults = [UserRecordEntity[], FieldPacket[]];

export class UserRecord implements UserRecordEntity {

    id?: string;
    name: string;
    surname: string;
    city: string;
    address: string;
    phone: number;
    email: string;
    readonly is_admin: boolean;
    login: string;
    password: string;


    constructor(obj: UserRecordEntity) {
        this.validateData(obj);
        this.validatePassword(obj.password);
        this.id = obj.id ?? uuid();
        this.name = obj.name;
        this.surname = obj.surname;
        this.city = obj.city;
        this.address = obj.address;
        this.phone = obj.phone;
        this.email = obj.email;
        this.is_admin = obj.is_admin;
        this.login = obj.login;
        this.password = obj.password;
    }

    static async checkIsUserAlreadyExist(obj: UserDataToValidateIsAlreadyExist): Promise<boolean> {
        let isFound = false;

        const [results] = await pool.execute('SELECT * from `users`') as UserResults;

        console.log(results);

        const arrOfSimplifiedUsers: UserDataToValidateIsAlreadyExist[] = results.map(user => {
            return {
                name: user.name,
                surname: user.surname,
                login: user.login,
                password: user.password
            }
        })

        console.log(arrOfSimplifiedUsers);

        for (const user of arrOfSimplifiedUsers) {
            if (obj.login === user.login
                && obj.password === user.password) {
                isFound = true;
            }
        }
        console.log(isFound);
        return isFound;
    }

    static async getOne(id: string): Promise<UserRecord | null> {
        const [results] = await pool.execute("SELECT * FROM `users` where `id`=:id", {
            id
        }) as UserResults;

        const userToReturn = results.map(user => new UserRecord({
            id: user.id,
            name: user.name,
            surname: user.surname,
            city: user.city,
            address: user.address,
            phone: user.phone,
            email: user.email,
            login: user.login,
            is_admin: user.is_admin,
            password: user.password
        }))

        return userToReturn.length ? userToReturn[0] : null;
    }

    static async getOneByLoginAndPassword(login: string, password: string): Promise<UserRecord | null> {
        const [results] = await pool.execute("SELECT * FROM `users` where `login`=:login and `password`=:password", {
            login,
            password
        }) as UserResults;

        const userToReturn = results.map(user => new UserRecord({
            id: user.id,
            name: user.name,
            surname: user.surname,
            city: user.city,
            address: user.address,
            phone: user.phone,
            email: user.email,
            login: user.login,
            is_admin: user.is_admin,
            password: user.password
        }))

        return userToReturn.length ? userToReturn[0] : null;
    }

    static async getAll(): Promise<UserRecord[] | null> {
        const [results] = await pool.execute("SELECT * FROM `users`") as UserResults;

        const userToReturn = results.map(user => new UserRecord({
            id: user.id,
            name: user.name,
            surname: user.surname,
            city: user.city,
            address: user.address,
            phone: user.phone,
            email: user.email,
            login: user.login,
            is_admin: user.is_admin,
            password: user.password
        }))

        return userToReturn.length ? userToReturn : null;
    }

    validateData({name, surname, city, address, phone, email, login}: UserRecordEntity): void {

        if (login.length < 5) {
            throw new UserError('Login should has 5- 50 characters');
        }

        if (name.length < 2 || name.length > 50) {
            throw new UserError('Name should has 2 - 50 characters');
        }
        if (surname.length < 2 || surname.length > 50) {
            throw new UserError('Surname should has 2 - 50 characters');
        }
        if (city.length < 2 || city.length > 50) {
            throw new UserError('City should has 2 - 50 characters');
        }
        if (address.length < 1 || address.length > 100) {
            throw new UserError('Address should has 1 - 100 characters');
        }
        if (phone.toString().length !== 9) {
            throw new UserError('Phone number should has 9 signs');
        }
        if (email.length < 6 || email.length > 60 || !email.split("").includes('@')) {
            throw new UserError('Email should has 6 - 60 characters and have @ sign');
        }
    }

    validatePassword(password: string): void {
        const arrOfSpecialSigns = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

        const arrFromPassword = password.split("");

        let specialFound = arrFromPassword.some(sign => arrOfSpecialSigns.includes(sign));

        let numberFound = arrFromPassword.some(sign => [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].includes(Number(sign)));

        if (password.length < 8 || password.length > 50 || !specialFound || !numberFound) {
            throw new UserError('Password should consists of 8 - 50 characters, has at least one number and special sign');
        }
    }

    async insert(): Promise<string> {
        try {
            await pool.execute("INSERT INTO `users` VALUES (:id,:name,:surname,:city,:address,:phone,:email,:is_admin,:login,:password)", {
                id: this.id,
                name: this.name,
                surname: this.surname,
                city: this.city,
                address: this.address,
                phone: this.phone,
                email: this.email,
                is_admin: this.is_admin,
                login: this.login,
                password: this.password
            })
            return this.id;
        } catch (e) {
            console.log(e);
        }
    }

    async update(): Promise<string> {
        try {
            await pool.execute("UPDATE `users` SET `name`=:name,`surname`=:surname,`city`=:city,`address`=:address,`phone`=:phone,`email`=:email,`is_admin`=:is_admin,`login`=:login,`password`=:password where `id`=:id", {
                id: this.id,
                name: this.name,
                surname: this.surname,
                city: this.city,
                address: this.address,
                phone: this.phone,
                email: this.email,
                is_admin: this.is_admin,
                login: this.login,
                password: this.password
            })
            return this.id;
        } catch (e) {
            console.log(e);
        }
    }

}