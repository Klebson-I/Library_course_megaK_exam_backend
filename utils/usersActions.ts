import {UserRecord, UserRecordEntity} from "../record/UserRecord";
import {v4 as uuid} from 'uuid';

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
            name: obj.name,
            password: obj.password
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


//creates login and password token

const getRandomElement = (arr: (string | number)[]): string | number => {
    return arr[Math.floor(Math.random() * arr.length)];
}

const createPassword = (id: string): string => {

    const arrOfSpecialSigns = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'];

    const arrOfNums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    const arrOfId = id.split("");

    let password = '';

    for (let i = 0; i < 5; i++) {
        password += getRandomElement(arrOfId);
        password += getRandomElement(arrOfNums);
        password += getRandomElement(arrOfSpecialSigns);
    }

    return password;
}

export const createAdminToken = (): { login: string, password: string } => {
    const login = uuid();
    const password = createPassword(uuid());
    return {
        login,
        password
    }
}

