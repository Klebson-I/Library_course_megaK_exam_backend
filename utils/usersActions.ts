import {UserRecord, UserRecordEntity} from "../record/UserRecord";

export const logInUser = async (login: string, password: string): Promise<boolean> => {
    try {
        const users = await UserRecord.getAll();
        return users.some(user => user.login === login && user.password === password);
    } catch (e) {
        console.log(e);
    }
}

export const registerUser = async (obj: UserRecordEntity): Promise<boolean> => {
    try {
        const exist = await UserRecord.checkIsUserAlreadyExist({
            login: obj.login,
            surname: obj.surname,
            name: obj.name
        })

        if (!exist) {
            const user = new UserRecord(obj);
            await user.insert();
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
    }
}