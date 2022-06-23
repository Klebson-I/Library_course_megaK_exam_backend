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