import {Request, Response, Router} from 'express';
import {registerUser} from "../utils/usersActions";
import {UserRecordEntity} from "../record/UserRecord";

export const RegisterRouter = Router();

RegisterRouter
    .post('/', async (req: Request, res: Response) => {
        const obj: UserRecordEntity = req.body;
        const isSuccessRegistration = await registerUser(obj);
        if (isSuccessRegistration) {
            res.json({
                regSuccess: true
            })
        } else {
            res.json({
                regSuccess: false
            })
        }
    })
