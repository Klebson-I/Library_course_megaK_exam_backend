import {Request, Response, Router} from 'express';
import {UserRecord} from "../record/UserRecord";

export const UserRouter = Router();

UserRouter
    .post('/', async (req: Request, res: Response) => {
        const {login, password} = req.body;
        const user = await UserRecord.getOneByLoginAndPassword(login, password);
        res.json(user);
    })