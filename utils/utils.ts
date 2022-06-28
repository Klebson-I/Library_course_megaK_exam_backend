import {BookRecord} from "../record/BookRecord";
import {HireEntity, HireFullEntity} from "./types";
import {HireRecord} from "../record/HireRecord";

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