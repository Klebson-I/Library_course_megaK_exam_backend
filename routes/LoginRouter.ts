import {Request, Response, Router} from 'express';
import {logInUser} from "../utils/usersActions";
import {UserRecord} from "../record/UserRecord";

export const LoginRouter = Router();

LoginRouter
    .post('/', async (req: Request, res: Response) => {
        const {login, password} = req.body;
        const isPassCorrect = await logInUser(String(login), String(password));
        if (isPassCorrect) {
            const user = await UserRecord.getOneByLoginAndPassword(login, password);
            res.json({
                log: true
            });
        } else {
            res.json({
                log: false
            })
        }
    })
