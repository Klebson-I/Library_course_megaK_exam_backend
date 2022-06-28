import {Request, Response, Router} from 'express';
import {registerUser} from "../utils/usersActions";

import {TokenRecord} from "../record/TokenRecord";
import {UserRecordEntity} from "../utils/types";

export const RegisterRouter = Router();

RegisterRouter
    .post('/', async (req: Request, res: Response) => {
        const obj: Omit<UserRecordEntity, 'is_admin'> = req.body;

        const isAdmin = await TokenRecord.checkIfAdmin(obj.login, obj.password);

        const isSuccessRegistration = await registerUser({
            ...obj,
            is_admin: isAdmin
        });

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
