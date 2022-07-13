import {Request, Response, Router} from 'express';
import {UserRecord} from "../record/UserRecord";
import {changeUserField} from "../utils/utils";

export const UserRouter = Router();

UserRouter
    .post('/', async (req: Request, res: Response) => {
        const {login, password} = req.body;
        const user = await UserRecord.getOneByLoginAndPassword(login, password);
        res.json(user);
    })
    .put('/', async (req: Request, res: Response) => {
        const body = req.body;
        const response = await changeUserField(body);
        res.json(response);
    })