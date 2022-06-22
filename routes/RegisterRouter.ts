import {Request, Response, Router} from 'express';
import {registerUser} from "../utils/usersActions";
import {UserRecordEntity} from "../record/UserRecord";
import {TokenRecord} from "../record/TokenRecord";

export const RegisterRouter = Router();

RegisterRouter
    .post('/', async (req: Request, res: Response) => {
        const obj: Omit<UserRecordEntity, 'is_admin'> = req.body;

        const isAdmin = await TokenRecord.checkIfAdmin(obj.login, obj.password);
        console.log("START REGISTRATION IN ROUTER")
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
