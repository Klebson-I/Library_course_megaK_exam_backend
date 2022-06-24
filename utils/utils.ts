import {BookRecord} from "../record/BookRecord";

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

export const changeBookAmount = async (book_id: string) => {
    const book = await BookRecord.getOne(book_id);
    book.amount -= 1;
    await book.update();
}