import {Request, Response, Router} from 'express';
import {createAdminToken} from "../utils/usersActions";
import {TokenRecord} from "../record/TokenRecord";

export const TokenRouter = Router();

TokenRouter
    //
    .get('/', async (req: Request, res: Response) => {
        const tokenObject = createAdminToken();
        const token = new TokenRecord({
            ...tokenObject
        })
        const token_id = await token.insert();

        if (token) {
            res.json({
                id: token_id,
                ...tokenObject
            });
        } else {
            res.json(null);
        }

    })
