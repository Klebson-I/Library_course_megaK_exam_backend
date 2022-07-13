import {BookRecord} from "../record/BookRecord";
import {BookAndAuthorsObject, HireEntity, HireFullEntity} from "./types";
import {HireRecord} from "../record/HireRecord";
import {UserRecord} from "../record/UserRecord";
import {AuthorRecord} from "../record/AuthorRecord";

export const evaluateDate = (): Date => {
    const date = new Date();

    const dataNow = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const twoWeekMS = 14 * 24 * 60 * 60 * 1000;

    return new Date(Math.abs(dataNow.getTime() + twoWeekMS));
}

export const createActualDate = (): Date => {
    const date = new Date();
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export const isExpire = (date: Date): boolean => {
    const actual = createActualDate();
    return date.getTime() - actual.getTime() < 0;
}


// @TODO to evaluate debt u need to have HireFullRecord as argument to let admin see who is with debt and with which book
export const evaluateDebtForBook = (hire: HireFullEntity | HireRecord | HireEntity): number => {
    const {expire_date} = hire;
    const actualDate = createActualDate();
    const dayMS = 24 * 60 * 60 * 1000;
    const days = Math.floor(Math.abs(actualDate.getTime() - expire_date.getTime()) / dayMS);
    const payForOneDay = 1;
    console.log(days);
    return days * payForOneDay;
}

export const changeBookAmount = async (book_id: string) => {
    const book = await BookRecord.getOne(book_id);
    book.amount -= 1;
    await book.update();
}

interface UpdateUserObjectFromFrontend {
    oldLogin: string;
    oldPassword: string;
    phone?: number;
    email?: string;
    login?: string;
    password?: string;
}


export const changeUserField = async (obj: any) => {
    const user = await UserRecord.getOneByLoginAndPassword(obj.oldLogin, obj.oldPassword);

    if (!user) {
        return "Invalid passes";
    }

    if (obj.login) {
        const exist = await UserRecord.checkIsUserAlreadyExist({
            name: user.name,
            surname: user.surname,
            login: obj.login,
            password: user.password
        })
        if (exist) return "Cannot use this login";
        user.login = obj.login;
    } else if (obj.password) {
        const exist = await UserRecord.checkIsUserAlreadyExist({
            name: user.name,
            surname: user.surname,
            login: user.login,
            password: obj.password
        })
        if (exist) return "Cannot use this password";
        user.password = obj.password;
    } else if (obj.phone) {
        user.phone = obj.phone;
    } else if (obj.email) {
        user.email = obj.email;
    }

    user.validateData({
        login: user.login,
        surname: user.surname,
        city: user.city,
        address: user.address,
        phone: user.phone,
        email: user.email,
        is_admin: user.is_admin,
        password: user.password,
        name: user.name,
    })

    user.validatePassword(user.password);

    console.log(user);

    await user.update();

    return "Successfully changed data";
}

export const handleBookInsertWithAuthors = async (obj: BookAndAuthorsObject): Promise<string> => {

    try {
        const newBook = new BookRecord({
            amount: obj.amount,
            year: obj.year,
            genre: obj.genre,
            title: obj.title
        })
        await newBook.insert();

        for await (const author of obj.authors) {
            const newAuthor = new AuthorRecord({
                name: author.split(" ")[0],
                surname: author.split(" ")[1],
                book_id: obj.id
            })
            await newAuthor.insert();
        }
    } catch (e) {
        return `${e}`;
    }
    return "Book inserted"
}